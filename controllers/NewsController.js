const { PrismaClient } = require("@prisma/client");
const uploadController = require("./UploadsController");

// select แบบพิเศษ
const prisma = new PrismaClient().$extends({
  result: {
    news: {
      news_file: {
        needs: { news_file: true },
        compute(news) {
          let new_file = null;
          if (news.news_file != null) {
            new_file = process.env.PATH_UPLOAD + news.news_file;
          }
          return new_file;
        },
      },
      //   news_type_name: {
      //     needs: { news_type: true },
      //     compute(news) {
      //       return news.news_type.name;
      //     },
      //   },
    },
  },
});

// ค้นหา
const filterData = (req) => {
  let $where = {
    deleted_at: null,
  };

  if (req.query.id) {
    $where["id"] = parseInt(req.query.id);
  }

  if (req.query.title) {
    $where["title"] = {
      contains: req.query.title,
      mode: "insensitive",
    };
  }

  if (req.query.news_type_id) {
    $where["news_type_id"] = parseInt(req.query.news_type_id);
  }

  if (req.query.is_publish) {
    $where["is_publish"] = parseInt(req.query.is_publish);
  }

  if (req.query.created_year) {
    $where["created_news"] = {
      gte: new Date(req.query.created_year + "-01-01 00:00:00").toISOString(),
      lte: new Date(req.query.created_year + "-12-31 23:59:00").toISOString(),
    };
  }

  if (req.query.created_month) {
    $where["created_news"] = {
      gte: new Date(
        req.query.created_year + "-" + req.query.created_month + "-01 00:00:00"
      ).toISOString(),
      lte: new Date(
        req.query.created_year + "-" + req.query.created_month + "-31 23:59:00"
      ).toISOString(),
    };
  }

  if (req.query.created_news) {
    $where["created_news"] = {
      gte: new Date(req.query.created_news + " 00:00:00").toISOString(),
      lte: new Date(req.query.created_news + " 23:59:00").toISOString(),
    };
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
    $orderBy = { created_at: "desc" };
  }

  //Count
  let $count = await prisma.news.findMany({
    select: selectField,
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
  title: true,
  news_type_id: true,
  detail: true,
  news_file: true,
  is_publish: true,
  count_views: true,
  created_news: true,
  news_type: {
    select: {
      name: true,
    },
  },
};

const methods = {
  // ค้นหาทั้งหมด
  async onGetAll(req, res) {
    try {
      let $where = filterData(req);
      let other = await countDataAndOrder(req, $where);

      const item = await prisma.news.findMany({
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
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  // ค้นหาเรคคอร์ดเดียว
  async onGetById(req, res) {
    try {
      const item = await prisma.news.findUnique({
        select: selectField,
        where: {
          id: Number(req.params.id),
        },
      });
      res.status(200).json({ data: item });
    } catch (error) {
      res.status(404).json({ msg: error.message });
    }
  },

  // สร้าง
  async onCreate(req, res) {
    try {
      let pathFile = await uploadController.onUploadFile(
        req,
        "/images/news/",
        "news_file"
      );

      if (pathFile == "error") {
        return res.status(500).send("error");
      }

      const item = await prisma.news.create({
        data: {
          news_type_id: Number(req.body.news_type_id),
          title: req.body.title,
          detail: req.body.detail,
          news_file: pathFile,
          is_publish: Number(req.body.is_publish),
          created_news: new Date(req.body.created_news),
          created_by: "arnonr",
          updated_by: "arnonr",
        },
      });
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  // แก้ไข
  async onUpdate(req, res) {
    try {
      let pathFile = await uploadController.onUploadFile(
        req,
        "/images/news/",
        "news_file"
      );

      if (pathFile == "error") {
        return res.status(500).send("error");
      }

      const item = await prisma.news.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          news_type_id:
            req.body.news_type_id != null
              ? Number(req.body.news_type_id)
              : undefined,
          title: req.body.title != null ? req.body.title : undefined,
          detail: req.body.detail != null ? req.body.detail : undefined,
          news_file: pathFile != null ? pathFile : undefined,
          is_publish:
            req.body.is_publish != null
              ? Number(req.body.is_publish)
              : undefined,
          created_news:
            req.body.created_news != null
              ? new Date(req.body.created_news)
              : undefined,
          updated_by: "arnonr",
        },
      });

      res.status(200).json(item);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },
  // ลบ
  async onDelete(req, res) {
    try {
      const item = await prisma.news.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          deleted_at: new Date().toISOString(),
        },
      });

      res.status(200).json(item);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },
};

module.exports = { ...methods };
