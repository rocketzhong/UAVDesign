export type dataBuffer = number[]
export enum ReceiveType {
    Status = '_Receive__Status',
    POWER = '_Receive__Power',
    RCDATA = '_Receive__RCDATA',
    Senser = '_Receive__Senser',
    PIDList = '_Receive__PIDList',
    PID2List = '_Receive__PID2List',
    SPIsOpen = '_Receive__SPIsOpen',
    SendPIDMessage = '_Receive__SendPIDMessage',

}
export enum SendType {
    SPList = '_SerialPort__List',
    PID = '_PID_DATA'
}

export type SpSendData = {
    buffer: number[]
}