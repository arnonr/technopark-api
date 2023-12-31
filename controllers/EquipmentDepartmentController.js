const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const filterData = (req) => {
  let $where = {
    deleted_at: null,
  };

  if (req.query.id) {
    $where["id"] = parseInt(req.query.id);
  }

  if (req.query.name_short) {
    $where["name_short"] = parseInt(req.query.name_short);
  }

  if (req.query.lang && req.query.lang == "en") {
    $where["name_en"] = {
      not: null,
    };
  }

  if (req.query.name_th) {
    $where["name_th"] = {
      contains: req.query.name_th,
      //   mode: "insensitive",
    };
  }

  if (req.query.name_en) {
    $where["name_en"] = {
      contains: req.query.name_en,
      //   mode: "insensitive",
    };
  }

  if (req.query.name) {
    if (req.query.lang && req.query.lang == "th") {
      $where["name_th"] = {
        contains: req.query.name,
      };
    } else {
      $where["name_en"]["contains"] = req.query.name;
    }
  }

  if (req.query.is_publish) {
    $where["is_publish"] = parseInt(req.query.is_publish);
  }

  return $where;
};

// หาจำนวนทั้งหมดและลำดับ
const countDataAndOrder = async (req, $where) => {
  //   Order
  let $orderBy = {};
  if (req.query.orderBy) {
    $orderBy[req.query.orderBy] = req.query.order;
  } else {
    $orderBy = { created_at: "asc" };
  }

  //Count
  let $count = await prisma.equipment_department.findMany({
    where: $where,
  });

  $count = $count.length;
  let $perPage = req.query.perPage ? Number(req.query.perPage) : 10;
  let $currentPage = req.query.currentPage ? Number(req.query.currentPage) : 1;
  let $totalPage =
    Math.ceil($count / $perPage) == 0 ? 1 : Math.ceil($count / $perPage);
  let $offset = $perPage * ($currentPage - 1);

  return {
    $orderBy: $orderBy,
    $offset: $offset,
    $perPage: $perPage,
    $count: $count,
    $totalPage: $totalPage,
    $currentPage: $currentPage,
  };
};

// ฟิลด์ที่ต้องการ Select รวมถึง join
const selectField = {
  id: true,
  name_th: true,
  name_en: true,
  is_publish: true,
  name: true,
};

const checkLanguage = (req) => {
  let prismaLang = prisma.$extends({
    result: {
      equipment_department: {
        name: {
          needs: { name_th: true },
          compute(table) {
            return req.query.lang && req.query.lang == "en"
              ? table.name_en
              : table.name_th;
          },
        },
      },
    },
  });

  return prismaLang;
};

const methods = {
  async onGetAll(req, res) {
    try {
      let $where = filterData(req);
      let other = await countDataAndOrder(req, $where);

      let prismaLang = checkLanguage(req);

      const item = await prismaLang.equipment_department.findMany({
        select: selectField,
        where: $where,
        orderBy: other.$orderBy,
        skip: other.$offset,
        take: other.$perPage,
      });

      res.status(200).json({
        data: item,
        totalData: other.$count,
        totalPage: other.$totalPage,
        currentPage: other.$currentPage,
        lang: req.query.lang ? req.query.lang : "",
        msg: " success",
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  async onGetById(req, res) {
    try {
      let prismaLang = checkLanguage(req);
      const item = await prismaLang.equipment_department.findUnique({
        select: selectField,
        where: {
          id: Number(req.params.id),
        },
      });

      res.status(200).json({
        data: item,
        msg: " success",
      });
    } catch (error) {
      res.status(404).json({ msg: error.message });
    }
  },
};

module.exports = { ...methods };
