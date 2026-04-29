import ImageModel from "../model/ImageModel";
import api from "../../../lib/http";

// Tao phuong thuc lay hinh anh
async function getImage(endpoint: string): Promise<ImageModel[]> {
    //Goi phuong thuc request
    const response = await api.get(endpoint)

    //Lay ra json sach
    const responseData = response._embedded.images;

    const data = responseData.map((image: ImageModel) =>
        new ImageModel(
            image.idImage,
            image.nameImage,
            image.thumbnail,
            image.urlImage,
            image.dataImage)
    )

    console.log(data);

    return data;

}

// Tao phuong thuc lay hinh anh theo id sach
export async function getAllImageByBook(idBook: number): Promise<ImageModel[]> {
    
    //Xac dinh endpoint
    const endpoint: string = `/books/${idBook}/listImages`;

    return getImage(endpoint);
}

