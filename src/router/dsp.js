// src/router/dsp.js
import express from "express";
import { query } from "../db.js";

const router = express.Router();

const clean = (val) => (val === "" ? null : val);

router.get("/", async (_req, res) => {
  try {
    const result = await query(`
      SELECT *
      FROM [PROJECT_LEGO].[dbo].[dsp_foreign]
      ORDER BY Collection_ID DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching DSP records:", err.message);
    res.status(500).json({ error: "Failed to fetch DSP records" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      Collection_ID,
      Coverage_Period,
      Society,
      Claim_Type,
      Email_Subject,
      Status,
      Notification_date,
      Deadline_of_Billing,
      Date_Received,
      Gross,
      Currency,
      Exchange_Rate,
      Peso_Value,
      DDM_Remarks,
      Licensing_Remarks,
      DSP,
      Date_billed,
      "SI#": SI,
      "BI#": BI,
      Division,
      Amount_Received,
      Bank_Charge,
      Total_Amount,
      Variance,
      Data_Coverage,
      Origin,
      Licensor,
      Licensee,
      Territory,
      "%VAT": VAT,
      Total_Gross_Amount,
      CWT,
      Rights_Covered,
      Contract_Status,
      Covered_Service,
      Source_Type,
      Category,
      Establishment,
    } = req.body;

    let finalCollectionId = Collection_ID;

    const params = {
      Collection_ID: finalCollectionId,
      Coverage_Period: clean(Coverage_Period),
      Society: clean(Society),
      Claim_Type: clean(Claim_Type),
      Email_Subject: clean(Email_Subject),
      Status: clean(Status),
      Notification_date: clean(Notification_date),
      Deadline_of_Billing: clean(Deadline_of_Billing),
      Date_Received: clean(Date_Received),
      Gross: clean(Gross),
      Currency: clean(Currency),
      Exchange_Rate: clean(Exchange_Rate),
      Peso_Value: clean(Peso_Value),
      DDM_Remarks: clean(DDM_Remarks),
      Licensing_Remarks: clean(Licensing_Remarks),
      DSP: clean(DSP),
      Date_billed: clean(Date_billed),
      "SI#": clean(SI),
      "BI#": clean(BI),
      Division: clean(Division),
      Amount_Received: clean(Amount_Received),
      Bank_Charge: clean(Bank_Charge),
      Total_Amount: clean(Total_Amount),
      Variance: clean(Variance),
      Data_Coverage: clean(Data_Coverage),
      Origin: clean(Origin),
      Licensor: clean(Licensor),
      Licensee: clean(Licensee),
      Territory: clean(Territory),
      "%VAT": clean(VAT),
      Total_Gross_Amount: clean(Total_Gross_Amount),
      CWT: clean(CWT),
      Rights_Covered: clean(Rights_Covered),
      Contract_Status: clean(Contract_Status),
      Covered_Service: clean(Covered_Service),
      Source_Type: clean(Source_Type),
      Category: clean(Category),
      Establishment: clean(Establishment),
    };

    const columns = Object.keys(params)
      .map((c) => `[${c}]`)
      .join(", ");
    const values = Object.keys(params)
      .map((_, i) => `@val${i}`)
      .join(", ");

    const sql = `INSERT INTO [PROJECT_LEGO].[dbo].[dsp_foreign] (${columns}) VALUES (${values})`;

    const sqlParams = {};
    Object.keys(params).forEach((col, i) => {
      sqlParams[`val${i}`] = params[col];
    });

    await query(sql, sqlParams);

    res.status(201).json({
      success: true,
      message: "DSP record created successfully",
      Collection_ID: finalCollectionId,
    });
  } catch (err) {
    console.error("Error inserting DSP record:", err.message);
    res.status(500).json({ error: "Failed to create DSP record" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (
        key === "Collection_ID" ||
        key === "Coverage_Start_Date" ||
        key === "Coverage_End_Date"
      )
        continue;
      updates[key] = clean(value);
    }
    const setClause = Object.keys(updates)
      .map((col, i) => `[${col}] = @val${i}`)
      .join(", ");
    const sql = `UPDATE [PROJECT_LEGO].[dbo].[dsp_foreign] SET ${setClause} WHERE Collection_ID = @id`;
    const sqlParams = { id };
    Object.keys(updates).forEach((col, i) => {
      sqlParams[`val${i}`] = updates[col];
    });
    await query(sql, sqlParams);
    res.json({ success: true, message: "DSP record updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update DSP record" });
  }
});

export default router;
