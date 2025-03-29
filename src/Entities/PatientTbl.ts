import { Entity, BaseEntity, PrimaryGeneratedColumn, Column,   Generated } from "typeorm"

@Entity({ name: "Patient" })
export class Patient extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id" })
    @Generated('uuid')
    id: any

    @Column({ name: "name", type: "varchar", length: 70, default: null, })
    name: any

    @Column({ name: "gender", type: "varchar", length: 10, default: null })
    gender: any

    @Column({ name: "email", type: "varchar", length: 100, default: null })
    email: any

    @Column({ name: "contact", type: "varchar", length: 10, default: null })
    contact: any

    @Column({ name: "password", type: "varchar", length: 255, default: "Test@1234" })
    password: any

    @Column({ name: "age", type: "int", default: null })
    age: any

    @Column({ name: "bloodGroup", type: "varchar", length: 10, default: null })
    bloodGroup: any

    @Column({ name: "aadhaarNo", type: "varchar", length: 20, default: null })
    aadhaarNo: any

    @Column({ name: "isActive", type: "boolean", default: null })
    isActive: any

    @Column({ name: "token", type: "varchar", length: 255, default: null })
    token: any

    @Column({ name: "createdAt", type: "timestamptz" ,default:()=>'CURRENT_TIMESTAMP'})
    createdAt: any

    @Column({ name: "updatedAt", type: "timestamptz" ,default:()=>'CURRENT_TIMESTAMP'})
    updatedAt: any;

}