export type dataBuffer = number[]
export enum ReceiveType {
    Status = '_Receive__Status',
    PID1 = '_Receive__PID1',
    POWER = '_Receive__Power',
    RCDATA = '_Receive__RCDATA',
    Senser = '_Receive__Senser',
    PIDList = '_Receive__PIDList',
    SPIsOpen = '_Receive__SPIsOpen',

}
export enum SendType {
    SPList = '_SerialPort__List',
    PID = '_PID_DATA'
}

export type SpSendData = {
    buffer: number[]
}