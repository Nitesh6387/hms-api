import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "Contact" })
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id!: number;

  @Column({ name: "name", type: "varchar", length: 100 })
  name!: string;

  @Column({ name: "email", type: "varchar", length: 100 })
  email!: string;

  @Column({ name: "subject", type: "varchar", length: 255 })
  subject!: string;

  @Column({ name: "message", type: "text" })
  message!: string;

  @Column({ name: "phone", type: "varchar", length: 20, nullable: true })
  phone?: string;

  @Column({ name: "isRead", type: "boolean", default: false })
  isRead!: boolean;

  @CreateDateColumn({ name: "createdAt", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updatedAt", type: "timestamptz" })
  updatedAt!: Date;
}
