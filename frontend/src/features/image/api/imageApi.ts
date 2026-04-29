import ImageModel from "../model/ImageModel";
import api from "../../../lib/http";

// Tao phuong thuc lay hinh anh
async function getImage(endpoint: string): Promise<ImageModel[]> {
    //Goi phuong thuc request
    const response: any = await api.get(endpoint);

    const responseData = response?.data ?? [];

    const data = responseData.map((image: any) =>
        new ImageModel(
            image.idImage,
            image.nameImage,
            image.isThumbnail,
            image.urlImage,
            image.dataImage
        )
    );

    return data;

}

// Tao phuong thuc lay hinh anh theo id sach
export async function getAllImageByBook(idBook: number): Promise<ImageModel[]> {
    
    //Xac dinh endpoint
    const endpoint: string = `/books/${idBook}/listImages`;

    return getImage(endpoint);
}

