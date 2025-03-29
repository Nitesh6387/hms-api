import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Generated } from "typeorm"

@Entity({ name: "Admin" })
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  @Generated('uuid')
  id: any

  @Column({ name: "name", type: "varchar", length: 70, default: null, })
  name: any

  @Column({ name: "profile", type: "text", default: null })
  profile: any

  @Column({ name: "email", type: "varchar", length: 100, default: null })
  email: any

  @Column({ name: "password", type: "varchar", length: 255, default: "Test@1234" })
  password: any

  @Column({ name: "address", type: "text", default: null })
  address: any

  @Column({ name: "contact", type: "varchar", length: 10, default: null })
  contact: any

  @Column({ name: "token", type: "varchar", length: 255, default: null })
  token: any

  @Column({ name: "createdAt", type: "timestamptz", default: () => 'CURRENT_TIMESTAMP' })
  createdAt: any

  @Column({ name: "updatedAt", type: "timestamptz", default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: any

}