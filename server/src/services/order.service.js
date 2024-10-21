const OrderService = {};

const generateInvoiceId = require('../utils/generate-invoice');

OrderService.requestInvoice = async (userId, requestData) => {
  const { customerData, itemsData } = requestData;

  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const invoiceData = {
    invoiceNumber: await generateInvoiceId(),
    status: 0,
    customerId: userData.id.toString(),
    customerName: userData.username,
    customerEmail: userData.email,
    ...customerData,
    invoiceDate: new Date(),
  };

  const newInvoice = await prisma.invoice.create({
    data: {
      ...invoiceData,
      user: {
        connect: { id: userData.id },
      },
      items: {
        create: itemsData,
      },
    },
    include: {
      user: false,
      items: true,
    },
  });

  return newInvoice;
};

OrderService.offerPrice = async (offerData) => {
  const { invoiceId, itemUpdates } = offerData;

  await Promise.all(
    itemUpdates.map((update) =>
      prisma.invoiceItem.update({
        where: {
          id: update.itemId,
        },
        data: {
          price: update.newPrice,
        },
      }),
    ),
  );

  const updatedInvoice = await prisma.invoice.update({
    where: {
      id: invoiceId,
    },
    data: {
      status: 1,
    },
  });

  return updatedInvoice;
};

OrderService.acceptOffer = async (offerData) => {
  const { invoiceId } = offerData;

  const updatedInvoice = await prisma.invoice.update({
    where: {
      id: invoiceId,
    },
    data: {
      status: 2,
    },
  });

  return updatedInvoice;
};

OrderService.approveOrder = async (offerData) => {
  const { invoiceId } = offerData;

  const updatedInvoice = await prisma.invoice.update({
    where: {
      id: invoiceId,
    },
    data: {
      status: 3,
    },
  });

  return updatedInvoice;
};

OrderService.getMyInvoices = async (userId) =>
  prisma.invoice.findMany({
    where: {
      userId,
    },
    include: {
      items: true,
    },
  });

OrderService.createInvoice = async (invoiceData) => {
  const { invoiceNumber, invoiceDate, invoiceAmount, userId } = invoiceData;

  const newInvoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      invoiceDate,
      invoiceAmount,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return newInvoice;
};

OrderService.getAllInvoices = async () => {
  const respond = prisma.invoice.findMany({
    include: {
      user: {
        select: {
          username: true,
          email: true,
          userType: true,
        },
      },
    },
  });
  return respond;
};

module.exports = OrderService;
