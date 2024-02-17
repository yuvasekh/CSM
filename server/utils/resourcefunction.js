const PDFDocument = require("pdf-lib").PDFDocument;
var fileTypemain = require("file-type");
const readFile = require("./formRecognizer");
const azureopenai = require("./openAI");
const { insertDocument, insertDocumentQuestions } = require("./sqlQueries");
require("dotenv").config();
let containerName = process.env.containerName;
async function ProcessUploadedFile(data, userId, source) {
  for (const result of data) {
    console.log(result, "In for");
    var fileType;
    fileType = result.mimetype.split("/")[1];
    let fileContent = result.buffer;
    let mainPDFBlobName = `${userId}.${fileType}`;
    console.log(
      "UPLOADING SPLIT PDF WHOS ID is mainPDFBlobName : ",
      mainPDFBlobName
    );
    await uploadBytesToBlobStorage(
      containerName,
      mainPDFBlobName,
      fileContent,
      result.mimetype
    );
    // var fileContent1 = await readFile(fileContent);
    // console.log(fileContent1, "check");
    // await azureopenai(fileContent);
  }
}
export default ProcessUploadedFile;
