import express from "express";
import { getAllAchat, saveAchat, deleteAchat, updateAchat, processPayment  } from "../controller/AchatController.js";
import {
  calculateDailyTotalSumByProduct,
  calculateDailyTotalSum,
  calculateMonthlyTotalSum,
  calculateAnnualTotalSum,
  calculateWeeklyTotalSum,
  findTopSoldProductsInMonth,
  calculateDailyTotalSumForDateRange,
  chartMounthly,
  checkStockAndTriggerAlert,
  calculateAverageDailyRevenue,
} from "../controller/EvaluationController.js";
import { getHistoriqueAchatsUtilisateur } from "../controller/AchatController.js";

const achatRouter = express.Router();

achatRouter.get("/achat", getAllAchat);
achatRouter.post("/createAchat", saveAchat);
achatRouter.delete("/deleteAchat/:id", deleteAchat);
achatRouter.put("/updAchat/:id", updateAchat);

achatRouter.get("/dailyByProduct", calculateDailyTotalSumByProduct);
achatRouter.get("/dailyTotal", calculateDailyTotalSum);
achatRouter.get("/weeklyTotal", calculateWeeklyTotalSum);
achatRouter.get("/monthlyTotal", calculateMonthlyTotalSum);
achatRouter.get("/yTotal", calculateAnnualTotalSum);
achatRouter.get("/topProduit", findTopSoldProductsInMonth);
achatRouter.get("/chart", calculateDailyTotalSumForDateRange);
achatRouter.get("/salesChart", chartMounthly);
achatRouter.get("/checkStock", checkStockAndTriggerAlert);
achatRouter.post("/processpayment", processPayment);
achatRouter.get("/avg", calculateAverageDailyRevenue);
achatRouter.get("/historiqueAchats", getHistoriqueAchatsUtilisateur);

export default achatRouter;