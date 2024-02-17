const {
  AzureKeyCredential,
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");

const stream = require("stream");
async function readFile(fileBuffer) {
  const endpoint = process.env.formrecognizer;
  const key1 = process.env.key1;
  const readableStream = new stream.PassThrough();
  readableStream.end(fileBuffer);
  // console.log(readableStream,"checking")
  const client = new DocumentAnalysisClient(
    endpoint,
    new AzureKeyCredential(key1)
  );
  const fileContent = {};
  try {
    const poller = await client.beginAnalyzeDocument(
      "prebuilt-read",
      readableStream
    );

    const { pages } = await poller.pollUntilDone();

    if (pages.length > 0) {
      for (const page of pages) {
        var pageno = page.pageNumber;
        var pagecontent = "";

        if (page.lines.length > 0) {
          for (const line of page.lines) {
            pagecontent = pagecontent + "\n" + line.content;
          }
        }

        pagecontent = pagecontent.trim();
        if (pagecontent !== "") {
          fileContent[pageno] = pagecontent;
        }
      }
    }
  } catch (err) {
    console.log("Ocr ERROR");
    console.log(err);
  }

  // console.log(fileContent, "fileContent");
  return fileContent;
}
module.exports.readFile = readFile;
