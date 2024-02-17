require("dotenv").config();
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} = require("@azure/storage-blob");
async function uploadBytesToBlobStorage(
  containerName,
  blobName,
  bytes,
  contentType
) {
  // console.log('containerName',containerName)
  let contentTypes = ["audio/wav", "video/mp4", "audio/mp3"];
  console.log("contentType", contentType, contentTypes.includes(contentType));
  const connectionString = process.env.connectionString;
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  if (contentTypes.includes(contentType)) {
    await blockBlobClient.uploadData(bytes, {
      blobHTTPHeaders: { blobContentType: contentType },
    });
  } else {
    await blockBlobClient.uploadData(bytes);
  }
  //  console.log('data',data)
}
module.exports.uploadBytesToBlobStorage = uploadBytesToBlobStorage;
