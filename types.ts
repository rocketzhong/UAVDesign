export type dataBuffer = number[]
export enum ReceiveType {
    Status = '_Receive__Status',
    PID1 = '_Receive__PID1'
}
export enum SendType {
    SPList = '_SerialPort__List',
    PID = '_PID_DATA'
}

export type SpSendData = {
    buffer: number[]
}