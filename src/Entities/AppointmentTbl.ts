import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Generated } from "typeorm"

@Entity({ name: "AppointmentTbl" })
export class AppointmentTbl extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id" })
    @Generated('uuid')
    id: any

    @Column({ name: "patientId", type: "varchar", default: null })
    patientId: any

    @Column({ name: "departmentId", type: "varchar", default: null })
    departmentId: any

    @Column({ name: "doctorId", type: "varchar", default: null })
    doctorId: any

    @Column({ name: "disease", type: "text", default: null })
    disease: any

    @Column({ name: "symptoms", type: "text", default: null })
    symptoms: any

    @Column({ name: "payment", type: "varchar", default: null, })
    payment: any

    @Column({ name: "status", type: "varchar", length: 50, default: "In-progress" })
    status: any

    @Column({ name: "appointmentType", type: "varchar", length: 50, default: null })
    appointmentType: any

    @Column({ name: "date", type: "date", default: null })
    date: any


    @Column({ name: "startTime", type: "time", default: null })
    startTime: any

    @Column({ name: "createdAt", type: "timestamptz", default: () => 'CURRENT_TIMESTAMP' })
    createdAt: any

    @Column({ name: "updatedAt", type: "timestamptz", default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: any

}