import { Column, DataType, Model, Table, HasMany } from "sequelize-typescript";

interface ISocialLinkCreationAttr {
    name: string;
    icon: string;
}

@Table({ tableName: "social_link" })
export class SocialLink extends Model<SocialLink, ISocialLinkCreationAttr> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    icon: string;
}