import imagekitInstance from ''

const UploadFilesMiddleWare = async (req, res, next) => {
    try {

        const files = req?.files




        if (files) {
            // const uploads = await Promise.all(
            //     files.map((file) =>
            //         imagekitin.upload({
            //             file,
            //             fileName: file.name,
            //             folder: "/your-folder",
            //         })
            //     )
            // );
        }

        next()

    } catch (error) {
        console.log("Error on #UploadFilesMiddleware Error ---> ", error?.message || error)
        return res.status(500).json({ message: "ATTACHMENT_UPLOAD_WENT_WRONG" })
    }
}

export default UploadFilesMiddleWare