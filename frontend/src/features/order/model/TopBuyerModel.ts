class TopBuyerModel {
    idUser: number;
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string;
    avatar: string;
    totalOrderValue: number;

    constructor(
        idUser: number,
        firstName: string,
        lastName: string,
        username: string,
        phoneNumber: string,
        avatar: string,
        totalOrderValue: number
    ) {
        this.idUser = idUser;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.phoneNumber = phoneNumber;
        this.avatar = avatar;
        this.totalOrderValue = totalOrderValue;
    }
}

export default TopBuyerModel;
