const s3_keys = {
    region : process.env.REGION,
    accessKeyId : process.env.ACCESS_KEY_ID,
    secretAccessKey : process.env.SECRET_ACCESS_KEY,
    bucket_name : process.env.S3_BUCKET_NAME
}

module.export = s3_keys;