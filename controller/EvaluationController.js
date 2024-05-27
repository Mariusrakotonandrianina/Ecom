import Achats from "../model/achat.js";
import Product from "../model/addProduct.js";

export const calculateDailyTotalSumByProduct = async (req, res) => {
  try {
    const { year, month, day } = req.query;

    const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59);

    const dailyTotalByProduct = await Achats.aggregate([
      {
        $match: {
          dateAchat: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: "$product",
          total: { $sum: "$soldeTotal" },
          quantiteTotal: { $sum: "$quantite" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: "$productData",
      },
      {
        $project: {
          _id: 0,
          product: "$productData.nom",
          description: "$productData.description",
          total: 1,
          quantiteTotal: 1,
        },
      },
    ]);

    res.status(200).json({ dailyTotalByProduct });
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite." });
  }
};

export const calculateDailyTotalSum = async (req, res) => {
  try {
    const { year, month, day } = req.query;

    const startDate = new Date(year, month - 1, day, 0, 0, 0);
    const endDate = new Date(year, month - 1, day, 23, 59, 59);

    const dailyTotal = await Achats.aggregate([
      {
        $match: {
          dateAchat: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSolde: { $sum: "$soldeTotal" },
          totalQuantite: { $sum: "$quantite" },
          dates: { $push: "$dateAchat" },
        },
      },
    ]);

    res.status(200).json({ dailyTotal: dailyTotal[0] });
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite." });
  }
};
export const calculateMonthlyTotalSum = async (req, res) => {
  try {
    const { year, month } = req.query;
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);

    const monthlyTotal = await Achats.aggregate([
      {
        $match: {
          dateAchat: {
            $gte: firstDayOfMonth,
            $lte: lastDayOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$soldeTotal" },
          quantiteTotal: { $sum: "$quantite" },
        },
      },
    ]);

    res.status(200).json({ monthlyTotal: monthlyTotal[0] });
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite." });
  }
};

export const calculateAnnualTotalSum = async (req, res) => {
  try {
    const { year } = req.query;

    const firstDayOfYear = new Date(year, 0, 1);
    const lastDayOfYear = new Date(year, 11, 31);

    const annualTotal = await Achats.aggregate([
      {
        $match: {
          dateAchat: {
            $gte: firstDayOfYear,
            $lte: lastDayOfYear,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$soldeTotal" },
          quantiteTotal: { $sum: "$quantite" },
        },
      },
    ]);

    res.status(200).json({ annualTotal: annualTotal[0] });
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite." });
  }
};
export const calculateWeeklyTotalSum = async (req, res) => {
  try {
    const { year, month, day } = req.query;

    const date = new Date(year, month - 1, day);
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);

    startOfWeek.setDate(date.getDate() - date.getDay());
    endOfWeek.setDate(date.getDate() - date.getDay() + 6);

    const weeklyTotal = await Achats.aggregate([
      {
        $match: {
          dateAchat: {
            $gte: startOfWeek,
            $lte: endOfWeek,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSolde: { $sum: "$soldeTotal" },
          totalQuantite: { $sum: "$quantite" },
        },
      },
    ]);

    res.status(200).json({ weeklyTotal: weeklyTotal[0] });
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite." });
  }
};

export const findTopSoldProductsInMonth = async (req, res) => {
  const { year, month } = req.query;

  try {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    const topProducts = await Achats.aggregate([
      {
        $match: {
          dateAchat: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: "$product",
          totalSolde: { $sum: "$soldeTotal" },
          quantiteTotal: { $sum: "$quantite" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: "$productData",
      },
      {
        $project: {
          _id: 0,
          product: "$productData.nom",
          description: "$productData.description",
          totalSolde: 1,
          quantiteTotal: 1,
        },
      },
      {
        $sort: { totalSolde: -1 },
      },
      {
        $limit: 20,
      },
    ]);

    if (topProducts.length > 0) {
      const formattedData = topProducts.map((item) => ({
        product: item.product,
        description: item.description,
        quantiteTotal: item.quantiteTotal,
        totalSolde: item.totalSolde,
      }));
      res.status(200).json({ topProducts: formattedData });
    } else {
      res
        .status(200)
        .json({ topProducts: [], message: "Aucun produit vendu ce mois-ci." });
    }
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite." });
  }
};

export const calculateDailyTotalSumForDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dailyTotal = await Achats.aggregate([
      {
        $match: {
          dateAchat: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateAchat" } },
          totalSolde: { $sum: "$soldeTotal" },
        },
      },
    ]);

    if (dailyTotal.length > 0) {
      res.status(200).json({ dailyTotal });
    } else {
      res.status(200).json({ dailyTotal: [] });
    }
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite." });
  }
};


export const chartMounthly = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesData = await Achats.aggregate([
      {
        $match: {
          dateAchat: {
            $gte: thirtyDaysAgo,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateAchat" } },
          totalSolde: { $sum: "$soldeTotal" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json(salesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const checkStockAndTriggerAlert = async (req, res) => {
  try {
    const productsWithLowStock = await Product.find({
      quantite: { $lt: 20 },
    });

    const lowStockProducts = productsWithLowStock.map((product) => {
      if (product) {
        return {
          nom: product.nom,
          quantite: product.quantite,
        };
      }
      return null;
    }).filter(Boolean);  
    
    
    if (lowStockProducts.length > 0) {
      res.status(200).json({ lowStockProducts, message: "Stock is low! Please restock." });
    } else {
      res.status(200).json({ message: "Stock is sufficient." });
    }
    
  } catch (error) {
    console.error("Erreur lors de la vérification de l'épuisement du stock :", error);
    res.status(500).json({ error: "Une erreur s'est produite." });
  }
};
export const calculateAverageDailyRevenue = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyRevenueData = await Achats.aggregate([
      {
        $match: {
          dateAchat: {
            $gte: thirtyDaysAgo,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateAchat" } },
          totalSolde: { $sum: "$soldeTotal" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const totalDays = dailyRevenueData.length;
    const totalRevenue = dailyRevenueData.reduce((acc, data) => acc + data.totalSolde, 0);
    const averageDailyRevenue = totalRevenue / totalDays;

    return { averageDailyRevenue };
  } catch (error) {
    console.error(error);
    throw new Error('Internal Server Error');
  }
};

