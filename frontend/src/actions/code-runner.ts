"use server";

import { judgeUrl } from "@/lib/constants";
import { getLanguageId } from "@/lib/utils";
import { ITab } from "@/types/app";
import axios from "axios";

const runCodeAction = async (data: ITab) => {
  const langId = getLanguageId(data.language);
  const submissionData = {
    source_code: Buffer.from(data.content).toString("base64"),
    language_id: langId,
    stdin: Buffer.from(data.input || "").toString("base64"),
  };

  try {
    const tokenRes = await axios.post(
      `${judgeUrl}/submissions?base64_encoded=true&wait=false`,
      submissionData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const token = tokenRes.data.token;

    if (!token) {
      return {
        success: false,
        message: "Error while creating a token for submission",
      };
    }

    let result;
    while (!result || result.status.id <= 2) {
      const resultRes = await axios.get(
        `${judgeUrl}/submissions/${token}?base64_encoded=false`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      result = resultRes.data;

      if (result.status.id > 2) break;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to create the submission",
      // @ts-expect-error: Handle error response which may not always have the expected structure
      error: error.response?.data || error.message,
    };
  }
};

export default runCodeAction;
