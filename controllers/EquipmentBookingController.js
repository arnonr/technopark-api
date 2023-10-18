const { PrismaClient } = require("@prisma/client");
const uploadController = require("./UploadsController");

const prisma = new PrismaClient();

// ค้นหา
const filterData = (req) => {
  let $where = {
    deleted_at: null,
  };

  if (req.query.id) {
    $where["id"] = parseInt(req.query.id);
  }

  if (req.query.user_id) {
    $where["user_id"] = parseInt(req.query.user_id);
  }

  if (req.query.equipment_id) {
    $where["equipment_id"] = parseInt(req.query.equipment_id);
  }

  if (req.query.firstname) {
    $where["firstname"] = {
      contains: req.query.firstname,
    };
  }

  if (req.query.surname) {
    $where["surname"] = {
      contains: req.query.surname,
    };
  }

  if (req.query.organization) {
    $where["organization"] = {
      contains: req.query.organization,
    };
  }

  if (req.query.email) {
    $where["email"] = {
      contains: req.query.email,
    };
  }

  if (req.query.tax_id) {
    $where["tax_id"] = {
      contains: req.query.tax_id,
    };
  }

  if (req.query.status_id) {
    $where["status_id"] = req.query.status_id;
  }

  if (req.query.is_publish) {
    $where["is_publish"] = parseInt(req.query.is_publish);
  }

  if (req.query.booking_date) {
    $where["booking_date"] = {
      gte: new Date(req.query.booking_date + " 00:00:00").toISOString(),
      lte: new Date(req.query.booking_date + " 23:59:00").toISOString(),
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
  let $count = await prisma.equipment_booking.findMany({
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
  user_id: true,
  equipment_id: true,
  booking_date: true,
  example: true,
  prefix: true,
  firstname: true,
  surname: true,
  organization: true,
  contact_address: true,
  phone: true,
  email: true,
  invoice_address: true,
  tax_id: true,
  price: true,
  reject_comment: true,
  confirmed_date: true,
  status_id: true,
  is_publish: true,
  period_time: true,
  equipment: {
    select: {
      title_th: true,
      title_en: true,
      title: true,
    },
  },
};

// ปรับ Language
const checkLanguage = (req) => {
  let prismaLang = prisma.$extends({
    result: {
      equipment: {
        title: {
          needs: { title_th: true },
          compute(table) {
            return req.query.lang && req.query.lang == "en"
              ? table.title_en
              : table.title_th;
          },
        },
      },
    },
  });

  return prismaLang;
};

const methods = {
  // ค้นหาทั้งหมด
  async onGetAll(req, res) {
    try {
      let $where = filterData(req);
      let other = await countDataAndOrder(req, $where);

      let prismaLang = checkLanguage(req);

      const item = await prismaLang.equipment_booking.findMany({
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
        msg: "success",
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  // ค้นหาเรคคอร์ดเดียว
  async onGetById(req, res) {
    try {
      let prismaLang = checkLanguage(req);
      const item = await prismaLang.equipment_booking.findUnique({
        select: selectField,
        where: {
          id: Number(req.params.id),
        },
      });
      res.status(200).json({ data: item, msg: " success" });
    } catch (error) {
      res.status(404).json({ msg: error.message });
    }
  },

  // สร้าง
  async onCreate(req, res) {
    try {
      const item = await prisma.equipment_booking.create({
        data: {
          booking_date: new Date(req.body.booking_date),
          period_time: Number(req.body.period_time),
          equipment_id: Number(req.body.equipment_id),
          user_id: Number(req.body.user_id),
          member_status: Number(req.body.member_status),
          example: req.body.example,
          prefix: req.body.prefix,
          firstname: req.body.firstname,
          surname: req.body.surname,
          organization: req.body.organization,
          contact_address: req.body.contact_address,
          phone: req.body.phone,
          email: req.body.email,
          invoice_address: req.body.invoice_address,
          tax_id: req.body.tax_id,
          price: req.body.price,
          //   reject_comment: req.body.reject_comment,
          //   confirmed_date: req.body.confirmed_date,
          status_id: Number(req.body.status_id),
          is_publish: Number(req.body.is_publish),
          created_by: "arnonr",
          updated_by: "arnonr",
        },
      });

      //   equipment_method
      for (let i = 0; i < req.body.equipment_method.length; i++) {
        let data_method = {
          equipment_booking_id: Number(item.id),
          equipment_method_id: Number(req.body.equipment_method[i].id),
          quantity: Number(req.body.equipment_method[i].quantity),
          price: Number(req.body.equipment_method[i].total_price),
          created_by: "arnonr",
          updated_by: "arnonr",
        };

        await prisma.equipment_booking_method.create({
          data: data_method,
        });
      }

      res.status(201).json({ ...item, msg: "success" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  // แก้ไข
  async onUpdate(req, res) {
    try {
      const item = await prisma.equipment_booking.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          user_id: req.body.user_id != null ? req.body.user_id : undefined,
          equipment_id:
            req.body.equipment_id != null
              ? Number(req.body.equipment_id)
              : undefined,
          example: req.body.example != null ? req.body.example : undefined,
          prefix: req.body.prefix != null ? req.body.prefix : undefined,
          firstname:
            req.body.firstname != null ? req.body.firstname : undefined,
          surname: req.body.surname != null ? req.body.surname : undefined,
          organization:
            req.body.organization != null ? req.body.organization : undefined,
          contact_address:
            req.body.contact_address != null
              ? req.body.contact_address
              : undefined,
          phone: req.body.phone != null ? req.body.phone : undefined,
          email: req.body.email != null ? req.body.email : undefined,
          invoice_address:
            req.body.invoice_address != null
              ? req.body.invoice_address
              : undefined,
          tax_id: req.body.tax_id != null ? req.body.tax_id : undefined,
          price: req.body.price != null ? req.body.price : undefined,
          reject_comment:
            req.body.reject_comment != null
              ? req.body.reject_comment
              : undefined,
          status_id:
            req.body.status_id != null ? req.body.status_id : undefined,
          is_publish:
            req.body.is_publish != null
              ? Number(req.body.is_publish)
              : undefined,
          booking_date:
            req.body.booking_date != null
              ? new Date(req.body.booking_date)
              : undefined,
          confirmed_date:
            req.body.confirmed_date != null
              ? new Date(req.body.confirmed_date)
              : undefined,
          updated_by: "arnonr",
        },
      });

      res.status(200).json({ ...item, msg: "success" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },
  // ลบ
  async onDelete(req, res) {
    try {
      const item = await prisma.equipment_booking.update({
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
