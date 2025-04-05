import { Entity, BaseEntity, PrimaryGeneratedColumn, Column , Generated } from "typeorm"

@Entity({ name: "Department" })

export class Department extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id" })
    @Generated('uuid')
    id: any

    @Column({ name: "name", type: "varchar", length: 70, default: null })
    name: any

    @Column({ name: "createdAt", type: "timestamptz" ,default:()=>'CURRENT_TIMESTAMP'})
    createdAt: any

    @Column({ name: "updatedAt", type: "timestamptz" ,default:()=>'CURRENT_TIMESTAMP'})
    updatedAt: any

}