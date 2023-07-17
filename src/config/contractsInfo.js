import { ModuleReference } from "@concordium/web-sdk";
import { Buffer } from "buffer/";

// CIS2 contract info
const MULTI_CONTRACT_MODULE_REF =
  "87106064b4586df05113cbec2e66f366dd3b7e7b49601814e00a4492a50e73af";
const MULTI_CONTRACT_SCHEMA = `//8DAQAAAA8AAABSZXBsaWNhVG9rZW4xODIACgAAAAkAAABiYWxhbmNlT2YGEAEUAAIAAAAIAAAAdG9rZW5faWQdAAcAAABhZGRyZXNzFQIAAAAHAAAAQWNjb3VudAEBAAAACwgAAABDb250cmFjdAEBAAAADBABGyUAAAAVBAAAAA4AAABJbnZhbGlkVG9rZW5JZAIRAAAASW5zdWZmaWNpZW50RnVuZHMCDAAAAFVuYXV0aG9yaXplZAIGAAAAQ3VzdG9tAQEAAAAVBgAAAAsAAABQYXJzZVBhcmFtcwIHAAAATG9nRnVsbAIMAAAATG9nTWFsZm9ybWVkAhMAAABJbnZhbGlkQ29udHJhY3ROYW1lAgwAAABDb250cmFjdE9ubHkCEwAAAEludm9rZUNvbnRyYWN0RXJyb3ICBAAAAG1pbnQEFAACAAAABQAAAG93bmVyFQIAAAAHAAAAQWNjb3VudAEBAAAACwgAAABDb250cmFjdAEBAAAADAYAAAB0b2tlbnMSAh0AFAACAAAADAAAAHRva2VuX2Ftb3VudBslAAAADAAAAG1ldGFkYXRhX3VybBQAAgAAAAMAAAB1cmwWAQQAAABoYXNoFQIAAAAEAAAATm9uZQIEAAAAU29tZQEBAAAAHiAAAAAVBAAAAA4AAABJbnZhbGlkVG9rZW5JZAIRAAAASW5zdWZmaWNpZW50RnVuZHMCDAAAAFVuYXV0aG9yaXplZAIGAAAAQ3VzdG9tAQEAAAAVBgAAAAsAAABQYXJzZVBhcmFtcwIHAAAATG9nRnVsbAIMAAAATG9nTWFsZm9ybWVkAhMAAABJbnZhbGlkQ29udHJhY3ROYW1lAgwAAABDb250cmFjdE9ubHkCEwAAAEludm9rZUNvbnRyYWN0RXJyb3ICDwAAAG9uUmVjZWl2aW5nQ0lTMgMVBAAAAA4AAABJbnZhbGlkVG9rZW5JZAIRAAAASW5zdWZmaWNpZW50RnVuZHMCDAAAAFVuYXV0aG9yaXplZAIGAAAAQ3VzdG9tAQEAAAAVBgAAAAsAAABQYXJzZVBhcmFtcwIHAAAATG9nRnVsbAIMAAAATG9nTWFsZm9ybWVkAhMAAABJbnZhbGlkQ29udHJhY3ROYW1lAgwAAABDb250cmFjdE9ubHkCEwAAAEludm9rZUNvbnRyYWN0RXJyb3ICCgAAAG9wZXJhdG9yT2YGEAEUAAIAAAAFAAAAb3duZXIVAgAAAAcAAABBY2NvdW50AQEAAAALCAAAAENvbnRyYWN0AQEAAAAMBwAAAGFkZHJlc3MVAgAAAAcAAABBY2NvdW50AQEAAAALCAAAAENvbnRyYWN0AQEAAAAMEAEBFQQAAAAOAAAASW52YWxpZFRva2VuSWQCEQAAAEluc3VmZmljaWVudEZ1bmRzAgwAAABVbmF1dGhvcml6ZWQCBgAAAEN1c3RvbQEBAAAAFQYAAAALAAAAUGFyc2VQYXJhbXMCBwAAAExvZ0Z1bGwCDAAAAExvZ01hbGZvcm1lZAITAAAASW52YWxpZENvbnRyYWN0TmFtZQIMAAAAQ29udHJhY3RPbmx5AhMAAABJbnZva2VDb250cmFjdEVycm9yAg8AAABzZXRJbXBsZW1lbnRvcnMEFAACAAAAAgAAAGlkFgAMAAAAaW1wbGVtZW50b3JzEAIMFQQAAAAOAAAASW52YWxpZFRva2VuSWQCEQAAAEluc3VmZmljaWVudEZ1bmRzAgwAAABVbmF1dGhvcml6ZWQCBgAAAEN1c3RvbQEBAAAAFQYAAAALAAAAUGFyc2VQYXJhbXMCBwAAAExvZ0Z1bGwCDAAAAExvZ01hbGZvcm1lZAITAAAASW52YWxpZENvbnRyYWN0TmFtZQIMAAAAQ29udHJhY3RPbmx5AhMAAABJbnZva2VDb250cmFjdEVycm9yAggAAABzdXBwb3J0cwYQARYAEAEVAwAAAAkAAABOb1N1cHBvcnQCBwAAAFN1cHBvcnQCCQAAAFN1cHBvcnRCeQEBAAAAEAAMFQQAAAAOAAAASW52YWxpZFRva2VuSWQCEQAAAEluc3VmZmljaWVudEZ1bmRzAgwAAABVbmF1dGhvcml6ZWQCBgAAAEN1c3RvbQEBAAAAFQYAAAALAAAAUGFyc2VQYXJhbXMCBwAAAExvZ0Z1bGwCDAAAAExvZ01hbGZvcm1lZAITAAAASW52YWxpZENvbnRyYWN0TmFtZQIMAAAAQ29udHJhY3RPbmx5AhMAAABJbnZva2VDb250cmFjdEVycm9yAg0AAAB0b2tlbk1ldGFkYXRhBhABHQAQARQAAgAAAAMAAAB1cmwWAQQAAABoYXNoFQIAAAAEAAAATm9uZQIEAAAAU29tZQEBAAAAHiAAAAAVBAAAAA4AAABJbnZhbGlkVG9rZW5JZAIRAAAASW5zdWZmaWNpZW50RnVuZHMCDAAAAFVuYXV0aG9yaXplZAIGAAAAQ3VzdG9tAQEAAAAVBgAAAAsAAABQYXJzZVBhcmFtcwIHAAAATG9nRnVsbAIMAAAATG9nTWFsZm9ybWVkAhMAAABJbnZhbGlkQ29udHJhY3ROYW1lAgwAAABDb250cmFjdE9ubHkCEwAAAEludm9rZUNvbnRyYWN0RXJyb3ICCAAAAHRyYW5zZmVyBBABFAAFAAAACAAAAHRva2VuX2lkHQAGAAAAYW1vdW50GyUAAAAEAAAAZnJvbRUCAAAABwAAAEFjY291bnQBAQAAAAsIAAAAQ29udHJhY3QBAQAAAAwCAAAAdG8VAgAAAAcAAABBY2NvdW50AQEAAAALCAAAAENvbnRyYWN0AQIAAAAMFgEEAAAAZGF0YRABAhUEAAAADgAAAEludmFsaWRUb2tlbklkAhEAAABJbnN1ZmZpY2llbnRGdW5kcwIMAAAAVW5hdXRob3JpemVkAgYAAABDdXN0b20BAQAAABUGAAAACwAAAFBhcnNlUGFyYW1zAgcAAABMb2dGdWxsAgwAAABMb2dNYWxmb3JtZWQCEwAAAEludmFsaWRDb250cmFjdE5hbWUCDAAAAENvbnRyYWN0T25seQITAAAASW52b2tlQ29udHJhY3RFcnJvcgIOAAAAdXBkYXRlT3BlcmF0b3IEEAEUAAIAAAAGAAAAdXBkYXRlFQIAAAAGAAAAUmVtb3ZlAgMAAABBZGQCCAAAAG9wZXJhdG9yFQIAAAAHAAAAQWNjb3VudAEBAAAACwgAAABDb250cmFjdAEBAAAADBUEAAAADgAAAEludmFsaWRUb2tlbklkAhEAAABJbnN1ZmZpY2llbnRGdW5kcwIMAAAAVW5hdXRob3JpemVkAgYAAABDdXN0b20BAQAAABUGAAAACwAAAFBhcnNlUGFyYW1zAgcAAABMb2dGdWxsAgwAAABMb2dNYWxmb3JtZWQCEwAAAEludmFsaWRDb250cmFjdE5hbWUCDAAAAENvbnRyYWN0T25seQITAAAASW52b2tlQ29udHJhY3RFcnJvcgIEAAAAdmlldwEUAAIAAAAFAAAAc3RhdGUQAg8VAgAAAAcAAABBY2NvdW50AQEAAAALCAAAAENvbnRyYWN0AQEAAAAMFAACAAAACAAAAGJhbGFuY2VzEAIPHQAbJQAAAAkAAABvcGVyYXRvcnMQAhUCAAAABwAAAEFjY291bnQBAQAAAAsIAAAAQ29udHJhY3QBAQAAAAwGAAAAdG9rZW5zEAIdAAEfBQAAAPsNAAAAVG9rZW5NZXRhZGF0YQACAAAACAAAAHRva2VuX2lkHQAMAAAAbWV0YWRhdGFfdXJsFAACAAAAAwAAAHVybBYBBAAAAGhhc2gVAgAAAAQAAABOb25lAgQAAABTb21lAQEAAAAeIAAAAPwOAAAAVXBkYXRlT3BlcmF0b3IAAwAAAAYAAAB1cGRhdGUVAgAAAAYAAABSZW1vdmUCAwAAAEFkZAIFAAAAb3duZXIVAgAAAAcAAABBY2NvdW50AQEAAAALCAAAAENvbnRyYWN0AQEAAAAMCAAAAG9wZXJhdG9yFQIAAAAHAAAAQWNjb3VudAEBAAAACwgAAABDb250cmFjdAEBAAAADP0EAAAAQnVybgADAAAACAAAAHRva2VuX2lkHQAGAAAAYW1vdW50GyUAAAAFAAAAb3duZXIVAgAAAAcAAABBY2NvdW50AQEAAAALCAAAAENvbnRyYWN0AQEAAAAM/gQAAABNaW50AAMAAAAIAAAAdG9rZW5faWQdAAYAAABhbW91bnQbJQAAAAUAAABvd25lchUCAAAABwAAAEFjY291bnQBAQAAAAsIAAAAQ29udHJhY3QBAQAAAAz/CAAAAFRyYW5zZmVyAAQAAAAIAAAAdG9rZW5faWQdAAYAAABhbW91bnQbJQAAAAQAAABmcm9tFQIAAAAHAAAAQWNjb3VudAEBAAAACwgAAABDb250cmFjdAEBAAAADAIAAAB0bxUCAAAABwAAAEFjY291bnQBAQAAAAsIAAAAQ29udHJhY3QBAQAAAAw=`;
export const CIS2_MULTI_CONTRACT_INFO = {
  contractName: "ReplicaToken182",
  moduleRef: new ModuleReference(MULTI_CONTRACT_MODULE_REF),
  schemaBuffer: Buffer.from(MULTI_CONTRACT_SCHEMA, "base64"),
  tokenIdByteSize: 1,
};

// PIXPEL contract info
const PIXPEL_SWAP_SCHEMA = `//8DAQAAAA0AAAByZXBsaWNhX3N3YXA0ABIAAAAMAAAAYWRkTGlxdWlkaXR5BBQAAgAAAAUAAAB0b2tlbhQAAgAAAAIAAABpZB0ABwAAAGFkZHJlc3MMDAAAAHRva2VuX2Ftb3VudBslAAAAFRwAAAAQAAAAUGFyc2VQYXJhbXNFcnJvcgIQAAAARXhjaGFuZ2VOb3RGb3VuZAIVAAAARXhjaGFuZ2VBbHJlYWR5RXhpc3RzAgcAAABMb2dGdWxsAgwAAABMb2dNYWxmb3JtZWQCEwAAAEludmFsaWRDb250cmFjdE5hbWUCDAAAAENvbnRyYWN0T25seQITAAAASW52b2tlQ29udHJhY3RFcnJvcgIWAAAASW52b2tlQ29udHJhY3ROb1Jlc3VsdAITAAAASW52b2tlVHJhbnNmZXJFcnJvcgILAAAAUGFyc2VQYXJhbXMCCwAAAFBhcnNlUmVzdWx0Ag4AAABJbnZhbGlkVG9rZW5JZAIRAAAASW5zdWZmaWNpZW50RnVuZHMCDAAAAFVuYXV0aG9yaXplZAIWAAAASW5jb3JyZWN0VG9rZW5DY2RSYXRpbwIMAAAAVG9rZW5Ob3RDaXMyAgsAAABOb3RPcGVyYXRvcgIRAAAAQ2FsbGVkQnlBQ29udHJhY3QCDgAAAEFtb3VudFRvb0xhcmdlAg4AAABNaXNzaW5nQWNjb3VudAIPAAAATWlzc2luZ0NvbnRyYWN0AhEAAABNaXNzaW5nRW50cnlwb2ludAINAAAATWVzc2FnZUZhaWxlZAILAAAATG9naWNSZWplY3QAAQAAAAYAAAByZWFzb24IBAAAAFRyYXACGAAAAEluc3VmZmljaWVudE91dHB1dEFtb3VudAIPAAAASW52YWxpZFJlc2VydmVzAgkAAABiYWxhbmNlT2YGEAEUAAIAAAAIAAAAdG9rZW5faWQdAAcAAABhZGRyZXNzFQIAAAAHAAAAQWNjb3VudAEBAAAACwgAAABDb250cmFjdAEBAAAADBABGyUAAAAVHAAAABAAAABQYXJzZVBhcmFtc0Vycm9yAhAAAABFeGNoYW5nZU5vdEZvdW5kAhUAAABFeGNoYW5nZUFscmVhZHlFeGlzdHMCBwAAAExvZ0Z1bGwCDAAAAExvZ01hbGZvcm1lZAITAAAASW52YWxpZENvbnRyYWN0TmFtZQIMAAAAQ29udHJhY3RPbmx5AhMAAABJbnZva2VDb250cmFjdEVycm9yAhYAAABJbnZva2VDb250cmFjdE5vUmVzdWx0AhMAAABJbnZva2VUcmFuc2ZlckVycm9yAgsAAABQYXJzZVBhcmFtcwILAAAAUGFyc2VSZXN1bHQCDgAAAEludmFsaWRUb2tlbklkAhEAAABJbnN1ZmZpY2llbnRGdW5kcwIMAAAAVW5hdXRob3JpemVkAhYAAABJbmNvcnJlY3RUb2tlbkNjZFJhdGlvAgwAAABUb2tlbk5vdENpczICCwAAAE5vdE9wZXJhdG9yAhEAAABDYWxsZWRCeUFDb250cmFjdAIOAAAAQW1vdW50VG9vTGFyZ2UCDgAAAE1pc3NpbmdBY2NvdW50Ag8AAABNaXNzaW5nQ29udHJhY3QCEQAAAE1pc3NpbmdFbnRyeXBvaW50Ag0AAABNZXNzYWdlRmFpbGVkAgsAAABMb2dpY1JlamVjdAABAAAABgAAAHJlYXNvbggEAAAAVHJhcAIYAAAASW5zdWZmaWNpZW50T3V0cHV0QW1vdW50Ag8AAABJbnZhbGlkUmVzZXJ2ZXMCDgAAAGNjZFRvVG9rZW5Td2FwBBQAAgAAAAUAAAB0b2tlbhQAAgAAAAIAAABpZB0ABwAAAGFkZHJlc3MMEAAAAG1pbl90b2tlbl9hbW91bnQbJQAAABUcAAAAEAAAAFBhcnNlUGFyYW1zRXJyb3ICEAAAAEV4Y2hhbmdlTm90Rm91bmQCFQAAAEV4Y2hhbmdlQWxyZWFkeUV4aXN0cwIHAAAATG9nRnVsbAIMAAAATG9nTWFsZm9ybWVkAhMAAABJbnZhbGlkQ29udHJhY3ROYW1lAgwAAABDb250cmFjdE9ubHkCEwAAAEludm9rZUNvbnRyYWN0RXJyb3ICFgAAAEludm9rZUNvbnRyYWN0Tm9SZXN1bHQCEwAAAEludm9rZVRyYW5zZmVyRXJyb3ICCwAAAFBhcnNlUGFyYW1zAgsAAABQYXJzZVJlc3VsdAIOAAAASW52YWxpZFRva2VuSWQCEQAAAEluc3VmZmljaWVudEZ1bmRzAgwAAABVbmF1dGhvcml6ZWQCFgAAAEluY29ycmVjdFRva2VuQ2NkUmF0aW8CDAAAAFRva2VuTm90Q2lzMgILAAAATm90T3BlcmF0b3ICEQAAAENhbGxlZEJ5QUNvbnRyYWN0Ag4AAABBbW91bnRUb29MYXJnZQIOAAAATWlzc2luZ0FjY291bnQCDwAAAE1pc3NpbmdDb250cmFjdAIRAAAATWlzc2luZ0VudHJ5cG9pbnQCDQAAAE1lc3NhZ2VGYWlsZWQCCwAAAExvZ2ljUmVqZWN0AAEAAAAGAAAAcmVhc29uCAQAAABUcmFwAhgAAABJbnN1ZmZpY2llbnRPdXRwdXRBbW91bnQCDwAAAEludmFsaWRSZXNlcnZlcwIXAAAAZ2V0Q2NkVG9Ub2tlblN3YXBBbW91bnQGFAACAAAABQAAAHRva2VuFAACAAAAAgAAAGlkHQAHAAAAYWRkcmVzcwwIAAAAY2NkX3NvbGQbJQAAABQAAQAAAAYAAABhbW91bnQbJQAAABUcAAAAEAAAAFBhcnNlUGFyYW1zRXJyb3ICEAAAAEV4Y2hhbmdlTm90Rm91bmQCFQAAAEV4Y2hhbmdlQWxyZWFkeUV4aXN0cwIHAAAATG9nRnVsbAIMAAAATG9nTWFsZm9ybWVkAhMAAABJbnZhbGlkQ29udHJhY3ROYW1lAgwAAABDb250cmFjdE9ubHkCEwAAAEludm9rZUNvbnRyYWN0RXJyb3ICFgAAAEludm9rZUNvbnRyYWN0Tm9SZXN1bHQCEwAAAEludm9rZVRyYW5zZmVyRXJyb3ICCwAAAFBhcnNlUGFyYW1zAgsAAABQYXJzZVJlc3VsdAIOAAAASW52YWxpZFRva2VuSWQCEQAAAEluc3VmZmljaWVudEZ1bmRzAgwAAABVbmF1dGhvcml6ZWQCFgAAAEluY29ycmVjdFRva2VuQ2NkUmF0aW8CDAAAAFRva2VuTm90Q2lzMgILAAAATm90T3BlcmF0b3ICEQAAAENhbGxlZEJ5QUNvbnRyYWN0Ag4AAABBbW91bnRUb29MYXJnZQIOAAAATWlzc2luZ0FjY291bnQCDwAAAE1pc3NpbmdDb250cmFjdAIRAAAATWlzc2luZ0VudHJ5cG9pbnQCDQAAAE1lc3NhZ2VGYWlsZWQCCwAAAExvZ2ljUmVqZWN0AAEAAAAGAAAAcmVhc29uCAQAAABUcmFwAhgAAABJbnN1ZmZpY2llbnRPdXRwdXRBbW91bnQCDwAAAEludmFsaWRSZXNlcnZlcwILAAAAZ2V0RXhjaGFuZ2UGFAACAAAABgAAAGhvbGRlchUCAAAABwAAAEFjY291bnQBAQAAAAsIAAAAQ29udHJhY3QBAQAAAAwFAAAAdG9rZW4UAAIAAAACAAAAaWQdAAcAAABhZGRyZXNzDBQABgAAAAUAAAB0b2tlbhQAAgAAAAIAAABpZB0ABwAAAGFkZHJlc3MMDQAAAHRva2VuX2JhbGFuY2UbJQAAAAsAAABjY2RfYmFsYW5jZRslAAAACwAAAGxwX3Rva2VuX2lkHQAQAAAAbHBfdG9rZW5zX3N1cHBseRslAAAAGAAAAGxwX3Rva2Vuc19ob2xkZXJfYmFsYW5jZRslAAAAFRwAAAAQAAAAUGFyc2VQYXJhbXNFcnJvcgIQAAAARXhjaGFuZ2VOb3RGb3VuZAIVAAAARXhjaGFuZ2VBbHJlYWR5RXhpc3RzAgcAAABMb2dGdWxsAgwAAABMb2dNYWxmb3JtZWQCEwAAAEludmFsaWRDb250cmFjdE5hbWUCDAAAAENvbnRyYWN0T25seQITAAAASW52b2tlQ29udHJhY3RFcnJvcgIWAAAASW52b2tlQ29udHJhY3ROb1Jlc3VsdAITAAAASW52b2tlVHJhbnNmZXJFcnJvcgILAAAAUGFyc2VQYXJhbXMCCwAAAFBhcnNlUmVzdWx0Ag4AAABJbnZhbGlkVG9rZW5JZAIRAAAASW5zdWZmaWNpZW50RnVuZHMCDAAAAFVuYXV0aG9yaXplZAIWAAAASW5jb3JyZWN0VG9rZW5DY2RSYXRpbwIMAAAAVG9rZW5Ob3RDaXMyAgsAAABOb3RPcGVyYXRvcgIRAAAAQ2FsbGVkQnlBQ29udHJhY3QCDgAAAEFtb3VudFRvb0xhcmdlAg4AAABNaXNzaW5nQWNjb3VudAIPAAAATWlzc2luZ0NvbnRyYWN0AhEAAABNaXNzaW5nRW50cnlwb2ludAINAAAATWVzc2FnZUZhaWxlZAILAAAATG9naWNSZWplY3QAAQAAAAYAAAByZWFzb24IBAAAAFRyYXACGAAAAEluc3VmZmljaWVudE91dHB1dEFtb3VudAIPAAAASW52YWxpZFJlc2VydmVzAgwAAABnZXRFeGNoYW5nZXMGFAABAAAABgAAAGhvbGRlchUCAAAABwAAAEFjY291bnQBAQAAAAsIAAAAQ29udHJhY3QBAQAAAAwUAAEAAAAJAAAAZXhjaGFuZ2VzEAIUAAYAAAAFAAAAdG9rZW4UAAIAAAACAAAAaWQdAAcAAABhZGRyZXNzDA0AAAB0b2tlbl9iYWxhbmNlGyUAAAALAAAAY2NkX2JhbGFuY2UbJQAAAAsAAABscF90b2tlbl9pZB0AEAAAAGxwX3Rva2Vuc19zdXBwbHkbJQAAABgAAABscF90b2tlbnNfaG9sZGVyX2JhbGFuY2UbJQAAABUcAAAAEAAAAFBhcnNlUGFyYW1zRXJyb3ICEAAAAEV4Y2hhbmdlTm90Rm91bmQCFQAAAEV4Y2hhbmdlQWxyZWFkeUV4aXN0cwIHAAAATG9nRnVsbAIMAAAATG9nTWFsZm9ybWVkAhMAAABJbnZhbGlkQ29udHJhY3ROYW1lAgwAAABDb250cmFjdE9ubHkCEwAAAEludm9rZUNvbnRyYWN0RXJyb3ICFgAAAEludm9rZUNvbnRyYWN0Tm9SZXN1bHQCEwAAAEludm9rZVRyYW5zZmVyRXJyb3ICCwAAAFBhcnNlUGFyYW1zAgsAAABQYXJzZVJlc3VsdAIOAAAASW52YWxpZFRva2VuSWQCEQAAAEluc3VmZmljaWVudEZ1bmRzAgwAAABVbmF1dGhvcml6ZWQCFgAAAEluY29ycmVjdFRva2VuQ2NkUmF0aW8CDAAAAFRva2VuTm90Q2lzMgILAAAATm90T3BlcmF0b3ICEQAAAENhbGxlZEJ5QUNvbnRyYWN0Ag4AAABBbW91bnRUb29MYXJnZQIOAAAATWlzc2luZ0FjY291bnQCDwAAAE1pc3NpbmdDb250cmFjdAIRAAAATWlzc2luZ0VudHJ5cG9pbnQCDQAAAE1lc3NhZ2VGYWlsZWQCCwAAAExvZ2ljUmVqZWN0AAEAAAAGAAAAcmVhc29uCAQAAABUcmFwAhgAAABJbnN1ZmZpY2llbnRPdXRwdXRBbW91bnQCDwAAAEludmFsaWRSZXNlcnZlcwIXAAAAZ2V0VG9rZW5Ub0NjZFN3YXBBbW91bnQGFAACAAAABQAAAHRva2VuFAACAAAAAgAAAGlkHQAHAAAAYWRkcmVzcwwKAAAAdG9rZW5fc29sZBslAAAAFAABAAAABgAAAGFtb3VudBslAAAAFRwAAAAQAAAAUGFyc2VQYXJhbXNFcnJvcgIQAAAARXhjaGFuZ2VOb3RGb3VuZAIVAAAARXhjaGFuZ2VBbHJlYWR5RXhpc3RzAgcAAABMb2dGdWxsAgwAAABMb2dNYWxmb3JtZWQCEwAAAEludmFsaWRDb250cmFjdE5hbWUCDAAAAENvbnRyYWN0T25seQITAAAASW52b2tlQ29udHJhY3RFcnJvcgIWAAAASW52b2tlQ29udHJhY3ROb1Jlc3VsdAITAAAASW52b2tlVHJhbnNmZXJFcnJvcgILAAAAUGFyc2VQYXJhbXMCCwAAAFBhcnNlUmVzdWx0Ag4AAABJbnZhbGlkVG9rZW5JZAIRAAAASW5zdWZmaWNpZW50RnVuZHMCDAAAAFVuYXV0aG9yaXplZAIWAAAASW5jb3JyZWN0VG9rZW5DY2RSYXRpbwIMAAAAVG9rZW5Ob3RDaXMyAgsAAABOb3RPcGVyYXRvcgIRAAAAQ2FsbGVkQnlBQ29udHJhY3QCDgAAAEFtb3VudFRvb0xhcmdlAg4AAABNaXNzaW5nQWNjb3VudAIPAAAATWlzc2luZ0NvbnRyYWN0AhEAAABNaXNzaW5nRW50cnlwb2ludAINAAAATWVzc2FnZUZhaWxlZAILAAAATG9naWNSZWplY3QAAQAAAAYAAAByZWFzb24IBAAAAFRyYXACGAAAAEluc3VmZmljaWVudE91dHB1dEFtb3VudAIPAAAASW52YWxpZFJlc2VydmVzAhkAAABnZXRUb2tlblRvVG9rZW5Td2FwQW1vdW50BhQAAwAAAAUAAAB0b2tlbhQAAgAAAAIAAABpZB0ABwAAAGFkZHJlc3MMDwAAAHB1cmNoYXNlZF90b2tlbhQAAgAAAAIAAABpZB0ABwAAAGFkZHJlc3MMCgAAAHRva2VuX3NvbGQbJQAAABQAAQAAAAYAAABhbW91bnQbJQAAABUcAAAAEAAAAFBhcnNlUGFyYW1zRXJyb3ICEAAAAEV4Y2hhbmdlTm90Rm91bmQCFQAAAEV4Y2hhbmdlQWxyZWFkeUV4aXN0cwIHAAAATG9nRnVsbAIMAAAATG9nTWFsZm9ybWVkAhMAAABJbnZhbGlkQ29udHJhY3ROYW1lAgwAAABDb250cmFjdE9ubHkCEwAAAEludm9rZUNvbnRyYWN0RXJyb3ICFgAAAEludm9rZUNvbnRyYWN0Tm9SZXN1bHQCEwAAAEludm9rZVRyYW5zZmVyRXJyb3ICCwAAAFBhcnNlUGFyYW1zAgsAAABQYXJzZVJlc3VsdAIOAAAASW52YWxpZFRva2VuSWQCEQAAAEluc3VmZmljaWVudEZ1bmRzAgwAAABVbmF1dGhvcml6ZWQCFgAAAEluY29ycmVjdFRva2VuQ2NkUmF0aW8CDAAAAFRva2VuTm90Q2lzMgILAAAATm90T3BlcmF0b3ICEQAAAENhbGxlZEJ5QUNvbnRyYWN0Ag4AAABBbW91bnRUb29MYXJnZQIOAAAATWlzc2luZ0FjY291bnQCDwAAAE1pc3NpbmdDb250cmFjdAIRAAAATWlzc2luZ0VudHJ5cG9pbnQCDQAAAE1lc3NhZ2VGYWlsZWQCCwAAAExvZ2ljUmVqZWN0AAEAAAAGAAAAcmVhc29uCAQAAABUcmFwAhgAAABJbnN1ZmZpY2llbnRPdXRwdXRBbW91bnQCDwAAAEludmFsaWRSZXNlcnZlcwIPAAAAb25SZWNlaXZpbmdDSVMyAxUcAAAAEAAAAFBhcnNlUGFyYW1zRXJyb3ICEAAAAEV4Y2hhbmdlTm90Rm91bmQCFQAAAEV4Y2hhbmdlQWxyZWFkeUV4aXN0cwIHAAAATG9nRnVsbAIMAAAATG9nTWFsZm9ybWVkAhMAAABJbnZhbGlkQ29udHJhY3ROYW1lAgwAAABDb250cmFjdE9ubHkCEwAAAEludm9rZUNvbnRyYWN0RXJyb3ICFgAAAEludm9rZUNvbnRyYWN0Tm9SZXN1bHQCEwAAAEludm9rZVRyYW5zZmVyRXJyb3ICCwAAAFBhcnNlUGFyYW1zAgsAAABQYXJzZVJlc3VsdAIOAAAASW52YWxpZFRva2VuSWQCEQAAAEluc3VmZmljaWVudEZ1bmRzAgwAAABVbmF1dGhvcml6ZWQCFgAAAEluY29ycmVjdFRva2VuQ2NkUmF0aW8CDAAAAFRva2VuTm90Q2lzMgILAAAATm90T3BlcmF0b3ICEQAAAENhbGxlZEJ5QUNvbnRyYWN0Ag4AAABBbW91bnRUb29MYXJnZQIOAAAATWlzc2luZ0FjY291bnQCDwAAAE1pc3NpbmdDb250cmFjdAIRAAAATWlzc2luZ0VudHJ5cG9pbnQCDQAAAE1lc3NhZ2VGYWlsZWQCCwAAAExvZ2ljUmVqZWN0AAEAAAAGAAAAcmVhc29uCAQAAABUcmFwAhgAAABJbnN1ZmZpY2llbnRPdXRwdXRBbW91bnQCDwAAAEludmFsaWRSZXNlcnZlcwIKAAAAb3BlcmF0b3JPZgYQARQAAgAAAAUAAABvd25lchUCAAAABwAAAEFjY291bnQBAQAAAAsIAAAAQ29udHJhY3QBAQAAAAwHAAAAYWRkcmVzcxUCAAAABwAAAEFjY291bnQBAQAAAAsIAAAAQ29udHJhY3QBAQAAAAwQAQEVHAAAABAAAABQYXJzZVBhcmFtc0Vycm9yAhAAAABFeGNoYW5nZU5vdEZvdW5kAhUAAABFeGNoYW5nZUFscmVhZHlFeGlzdHMCBwAAAExvZ0Z1bGwCDAAAAExvZ01hbGZvcm1lZAITAAAASW52YWxpZENvbnRyYWN0TmFtZQIMAAAAQ29udHJhY3RPbmx5AhMAAABJbnZva2VDb250cmFjdEVycm9yAhYAAABJbnZva2VDb250cmFjdE5vUmVzdWx0AhMAAABJbnZva2VUcmFuc2ZlckVycm9yAgsAAABQYXJzZVBhcmFtcwILAAAAUGFyc2VSZXN1bHQCDgAAAEludmFsaWRUb2tlbklkAhEAAABJbnN1ZmZpY2llbnRGdW5kcwIMAAAAVW5hdXRob3JpemVkAhYAAABJbmNvcnJlY3RUb2tlbkNjZFJhdGlvAgwAAABUb2tlbk5vdENpczICCwAAAE5vdE9wZXJhdG9yAhEAAABDYWxsZWRCeUFDb250cmFjdAIOAAAAQW1vdW50VG9vTGFyZ2UCDgAAAE1pc3NpbmdBY2NvdW50Ag8AAABNaXNzaW5nQ29udHJhY3QCEQAAAE1pc3NpbmdFbnRyeXBvaW50Ag0AAABNZXNzYWdlRmFpbGVkAgsAAABMb2dpY1JlamVjdAABAAAABgAAAHJlYXNvbggEAAAAVHJhcAIYAAAASW5zdWZmaWNpZW50T3V0cHV0QW1vdW50Ag8AAABJbnZhbGlkUmVzZXJ2ZXMCDwAAAHJlbW92ZUxpcXVpZGl0eQQUAAIAAAAFAAAAdG9rZW4UAAIAAAACAAAAaWQdAAcAAABhZGRyZXNzDA8AAABscF90b2tlbl9hbW91bnQbJQAAABUcAAAAEAAAAFBhcnNlUGFyYW1zRXJyb3ICEAAAAEV4Y2hhbmdlTm90Rm91bmQCFQAAAEV4Y2hhbmdlQWxyZWFkeUV4aXN0cwIHAAAATG9nRnVsbAIMAAAATG9nTWFsZm9ybWVkAhMAAABJbnZhbGlkQ29udHJhY3ROYW1lAgwAAABDb250cmFjdE9ubHkCEwAAAEludm9rZUNvbnRyYWN0RXJyb3ICFgAAAEludm9rZUNvbnRyYWN0Tm9SZXN1bHQCEwAAAEludm9rZVRyYW5zZmVyRXJyb3ICCwAAAFBhcnNlUGFyYW1zAgsAAABQYXJzZVJlc3VsdAIOAAAASW52YWxpZFRva2VuSWQCEQAAAEluc3VmZmljaWVudEZ1bmRzAgwAAABVbmF1dGhvcml6ZWQCFgAAAEluY29ycmVjdFRva2VuQ2NkUmF0aW8CDAAAAFRva2VuTm90Q2lzMgILAAAATm90T3BlcmF0b3ICEQAAAENhbGxlZEJ5QUNvbnRyYWN0Ag4AAABBbW91bnRUb29MYXJnZQIOAAAATWlzc2luZ0FjY291bnQCDwAAAE1pc3NpbmdDb250cmFjdAIRAAAATWlzc2luZ0VudHJ5cG9pbnQCDQAAAE1lc3NhZ2VGYWlsZWQCCwAAAExvZ2ljUmVqZWN0AAEAAAAGAAAAcmVhc29uCAQAAABUcmFwAhgAAABJbnN1ZmZpY2llbnRPdXRwdXRBbW91bnQCDwAAAEludmFsaWRSZXNlcnZlcwIIAAAAc3VwcG9ydHMGEAEWABABFQMAAAAJAAAATm9TdXBwb3J0AgcAAABTdXBwb3J0AgkAAABTdXBwb3J0QnkBAQAAABAADBUcAAAAEAAAAFBhcnNlUGFyYW1zRXJyb3ICEAAAAEV4Y2hhbmdlTm90Rm91bmQCFQAAAEV4Y2hhbmdlQWxyZWFkeUV4aXN0cwIHAAAATG9nRnVsbAIMAAAATG9nTWFsZm9ybWVkAhMAAABJbnZhbGlkQ29udHJhY3ROYW1lAgwAAABDb250cmFjdE9ubHkCEwAAAEludm9rZUNvbnRyYWN0RXJyb3ICFgAAAEludm9rZUNvbnRyYWN0Tm9SZXN1bHQCEwAAAEludm9rZVRyYW5zZmVyRXJyb3ICCwAAAFBhcnNlUGFyYW1zAgsAAABQYXJzZVJlc3VsdAIOAAAASW52YWxpZFRva2VuSWQCEQAAAEluc3VmZmljaWVudEZ1bmRzAgwAAABVbmF1dGhvcml6ZWQCFgAAAEluY29ycmVjdFRva2VuQ2NkUmF0aW8CDAAAAFRva2VuTm90Q2lzMgILAAAATm90T3BlcmF0b3ICEQAAAENhbGxlZEJ5QUNvbnRyYWN0Ag4AAABBbW91bnRUb29MYXJnZQIOAAAATWlzc2luZ0FjY291bnQCDwAAAE1pc3NpbmdDb250cmFjdAIRAAAATWlzc2luZ0VudHJ5cG9pbnQCDQAAAE1lc3NhZ2VGYWlsZWQCCwAAAExvZ2ljUmVqZWN0AAEAAAAGAAAAcmVhc29uCAQAAABUcmFwAhgAAABJbnN1ZmZpY2llbnRPdXRwdXRBbW91bnQCDwAAAEludmFsaWRSZXNlcnZlcwINAAAAdG9rZW5NZXRhZGF0YQYQAR0AEAEUAAIAAAADAAAAdXJsFgEEAAAAaGFzaBUCAAAABAAAAE5vbmUCBAAAAFNvbWUBAQAAABMgAAAAAhUcAAAAEAAAAFBhcnNlUGFyYW1zRXJyb3ICEAAAAEV4Y2hhbmdlTm90Rm91bmQCFQAAAEV4Y2hhbmdlQWxyZWFkeUV4aXN0cwIHAAAATG9nRnVsbAIMAAAATG9nTWFsZm9ybWVkAhMAAABJbnZhbGlkQ29udHJhY3ROYW1lAgwAAABDb250cmFjdE9ubHkCEwAAAEludm9rZUNvbnRyYWN0RXJyb3ICFgAAAEludm9rZUNvbnRyYWN0Tm9SZXN1bHQCEwAAAEludm9rZVRyYW5zZmVyRXJyb3ICCwAAAFBhcnNlUGFyYW1zAgsAAABQYXJzZVJlc3VsdAIOAAAASW52YWxpZFRva2VuSWQCEQAAAEluc3VmZmljaWVudEZ1bmRzAgwAAABVbmF1dGhvcml6ZWQCFgAAAEluY29ycmVjdFRva2VuQ2NkUmF0aW8CDAAAAFRva2VuTm90Q2lzMgILAAAATm90T3BlcmF0b3ICEQAAAENhbGxlZEJ5QUNvbnRyYWN0Ag4AAABBbW91bnRUb29MYXJnZQIOAAAATWlzc2luZ0FjY291bnQCDwAAAE1pc3NpbmdDb250cmFjdAIRAAAATWlzc2luZ0VudHJ5cG9pbnQCDQAAAE1lc3NhZ2VGYWlsZWQCCwAAAExvZ2ljUmVqZWN0AAEAAAAGAAAAcmVhc29uCAQAAABUcmFwAhgAAABJbnN1ZmZpY2llbnRPdXRwdXRBbW91bnQCDwAAAEludmFsaWRSZXNlcnZlcwIOAAAAdG9rZW5Ub0NjZFN3YXAEFAADAAAABQAAAHRva2VuFAACAAAAAgAAAGlkHQAHAAAAYWRkcmVzcwwKAAAAdG9rZW5fc29sZBslAAAADgAAAG1pbl9jY2RfYW1vdW50GyUAAAAVHAAAABAAAABQYXJzZVBhcmFtc0Vycm9yAhAAAABFeGNoYW5nZU5vdEZvdW5kAhUAAABFeGNoYW5nZUFscmVhZHlFeGlzdHMCBwAAAExvZ0Z1bGwCDAAAAExvZ01hbGZvcm1lZAITAAAASW52YWxpZENvbnRyYWN0TmFtZQIMAAAAQ29udHJhY3RPbmx5AhMAAABJbnZva2VDb250cmFjdEVycm9yAhYAAABJbnZva2VDb250cmFjdE5vUmVzdWx0AhMAAABJbnZva2VUcmFuc2ZlckVycm9yAgsAAABQYXJzZVBhcmFtcwILAAAAUGFyc2VSZXN1bHQCDgAAAEludmFsaWRUb2tlbklkAhEAAABJbnN1ZmZpY2llbnRGdW5kcwIMAAAAVW5hdXRob3JpemVkAhYAAABJbmNvcnJlY3RUb2tlbkNjZFJhdGlvAgwAAABUb2tlbk5vdENpczICCwAAAE5vdE9wZXJhdG9yAhEAAABDYWxsZWRCeUFDb250cmFjdAIOAAAAQW1vdW50VG9vTGFyZ2UCDgAAAE1pc3NpbmdBY2NvdW50Ag8AAABNaXNzaW5nQ29udHJhY3QCEQAAAE1pc3NpbmdFbnRyeXBvaW50Ag0AAABNZXNzYWdlRmFpbGVkAgsAAABMb2dpY1JlamVjdAABAAAABgAAAHJlYXNvbggEAAAAVHJhcAIYAAAASW5zdWZmaWNpZW50T3V0cHV0QW1vdW50Ag8AAABJbnZhbGlkUmVzZXJ2ZXMCEAAAAHRva2VuVG9Ub2tlblN3YXAEFAAEAAAABQAAAHRva2VuFAACAAAAAgAAAGlkHQAHAAAAYWRkcmVzcwwPAAAAcHVyY2hhc2VkX3Rva2VuFAACAAAAAgAAAGlkHQAHAAAAYWRkcmVzcwwKAAAAdG9rZW5fc29sZBslAAAAGgAAAG1pbl9wdXJjaGFzZWRfdG9rZW5fYW1vdW50GyUAAAAVHAAAABAAAABQYXJzZVBhcmFtc0Vycm9yAhAAAABFeGNoYW5nZU5vdEZvdW5kAhUAAABFeGNoYW5nZUFscmVhZHlFeGlzdHMCBwAAAExvZ0Z1bGwCDAAAAExvZ01hbGZvcm1lZAITAAAASW52YWxpZENvbnRyYWN0TmFtZQIMAAAAQ29udHJhY3RPbmx5AhMAAABJbnZva2VDb250cmFjdEVycm9yAhYAAABJbnZva2VDb250cmFjdE5vUmVzdWx0AhMAAABJbnZva2VUcmFuc2ZlckVycm9yAgsAAABQYXJzZVBhcmFtcwILAAAAUGFyc2VSZXN1bHQCDgAAAEludmFsaWRUb2tlbklkAhEAAABJbnN1ZmZpY2llbnRGdW5kcwIMAAAAVW5hdXRob3JpemVkAhYAAABJbmNvcnJlY3RUb2tlbkNjZFJhdGlvAgwAAABUb2tlbk5vdENpczICCwAAAE5vdE9wZXJhdG9yAhEAAABDYWxsZWRCeUFDb250cmFjdAIOAAAAQW1vdW50VG9vTGFyZ2UCDgAAAE1pc3NpbmdBY2NvdW50Ag8AAABNaXNzaW5nQ29udHJhY3QCEQAAAE1pc3NpbmdFbnRyeXBvaW50Ag0AAABNZXNzYWdlRmFpbGVkAgsAAABMb2dpY1JlamVjdAABAAAABgAAAHJlYXNvbggEAAAAVHJhcAIYAAAASW5zdWZmaWNpZW50T3V0cHV0QW1vdW50Ag8AAABJbnZhbGlkUmVzZXJ2ZXMCCAAAAHRyYW5zZmVyBBABFAAFAAAACAAAAHRva2VuX2lkHQAGAAAAYW1vdW50GyUAAAAEAAAAZnJvbRUCAAAABwAAAEFjY291bnQBAQAAAAsIAAAAQ29udHJhY3QBAQAAAAwCAAAAdG8VAgAAAAcAAABBY2NvdW50AQEAAAALCAAAAENvbnRyYWN0AQIAAAAMFgEEAAAAZGF0YR0BFRwAAAAQAAAAUGFyc2VQYXJhbXNFcnJvcgIQAAAARXhjaGFuZ2VOb3RGb3VuZAIVAAAARXhjaGFuZ2VBbHJlYWR5RXhpc3RzAgcAAABMb2dGdWxsAgwAAABMb2dNYWxmb3JtZWQCEwAAAEludmFsaWRDb250cmFjdE5hbWUCDAAAAENvbnRyYWN0T25seQITAAAASW52b2tlQ29udHJhY3RFcnJvcgIWAAAASW52b2tlQ29udHJhY3ROb1Jlc3VsdAITAAAASW52b2tlVHJhbnNmZXJFcnJvcgILAAAAUGFyc2VQYXJhbXMCCwAAAFBhcnNlUmVzdWx0Ag4AAABJbnZhbGlkVG9rZW5JZAIRAAAASW5zdWZmaWNpZW50RnVuZHMCDAAAAFVuYXV0aG9yaXplZAIWAAAASW5jb3JyZWN0VG9rZW5DY2RSYXRpbwIMAAAAVG9rZW5Ob3RDaXMyAgsAAABOb3RPcGVyYXRvcgIRAAAAQ2FsbGVkQnlBQ29udHJhY3QCDgAAAEFtb3VudFRvb0xhcmdlAg4AAABNaXNzaW5nQWNjb3VudAIPAAAATWlzc2luZ0NvbnRyYWN0AhEAAABNaXNzaW5nRW50cnlwb2ludAINAAAATWVzc2FnZUZhaWxlZAILAAAATG9naWNSZWplY3QAAQAAAAYAAAByZWFzb24IBAAAAFRyYXACGAAAAEluc3VmZmljaWVudE91dHB1dEFtb3VudAIPAAAASW52YWxpZFJlc2VydmVzAg4AAAB1cGRhdGVPcGVyYXRvcgQQARQAAgAAAAYAAAB1cGRhdGUVAgAAAAYAAABSZW1vdmUCAwAAAEFkZAIIAAAAb3BlcmF0b3IVAgAAAAcAAABBY2NvdW50AQEAAAALCAAAAENvbnRyYWN0AQEAAAAMFRwAAAAQAAAAUGFyc2VQYXJhbXNFcnJvcgIQAAAARXhjaGFuZ2VOb3RGb3VuZAIVAAAARXhjaGFuZ2VBbHJlYWR5RXhpc3RzAgcAAABMb2dGdWxsAgwAAABMb2dNYWxmb3JtZWQCEwAAAEludmFsaWRDb250cmFjdE5hbWUCDAAAAENvbnRyYWN0T25seQITAAAASW52b2tlQ29udHJhY3RFcnJvcgIWAAAASW52b2tlQ29udHJhY3ROb1Jlc3VsdAITAAAASW52b2tlVHJhbnNmZXJFcnJvcgILAAAAUGFyc2VQYXJhbXMCCwAAAFBhcnNlUmVzdWx0Ag4AAABJbnZhbGlkVG9rZW5JZAIRAAAASW5zdWZmaWNpZW50RnVuZHMCDAAAAFVuYXV0aG9yaXplZAIWAAAASW5jb3JyZWN0VG9rZW5DY2RSYXRpbwIMAAAAVG9rZW5Ob3RDaXMyAgsAAABOb3RPcGVyYXRvcgIRAAAAQ2FsbGVkQnlBQ29udHJhY3QCDgAAAEFtb3VudFRvb0xhcmdlAg4AAABNaXNzaW5nQWNjb3VudAIPAAAATWlzc2luZ0NvbnRyYWN0AhEAAABNaXNzaW5nRW50cnlwb2ludAINAAAATWVzc2FnZUZhaWxlZAILAAAATG9naWNSZWplY3QAAQAAAAYAAAByZWFzb24IBAAAAFRyYXACGAAAAEluc3VmZmljaWVudE91dHB1dEFtb3VudAIPAAAASW52YWxpZFJlc2VydmVzAgQAAAB2aWV3BRQABQAAAAkAAABleGNoYW5nZXMQAhQAAwAAAAoAAAB0b2tlbl9pbmZvFAACAAAAAgAAAGlkHQAHAAAAYWRkcmVzcwwOAAAAZXhjaGFuZ2Vfc3RhdGUUAAIAAAALAAAAbHBfdG9rZW5faWQdAAsAAABjY2RfYmFsYW5jZRslAAAADQAAAHRva2VuX2JhbGFuY2UbJQAAAA8AAABscF90b2tlbnNfc3RhdGUQAg8VAgAAAAcAAABBY2NvdW50AQEAAAALCAAAAENvbnRyYWN0AQEAAAAMFAACAAAACAAAAGJhbGFuY2VzEAIPHQAbJQAAAAkAAABvcGVyYXRvcnMQAhUCAAAABwAAAEFjY291bnQBAQAAAAsIAAAAQ29udHJhY3QBAQAAAAwQAAAAbHBfdG9rZW5zX3N1cHBseRACDx0AGyUAAAAQAAAAbGFzdF9scF90b2tlbl9pZB0AFAAAAGNvbnRyYWN0X2NjZF9iYWxhbmNlChUcAAAAEAAAAFBhcnNlUGFyYW1zRXJyb3ICEAAAAEV4Y2hhbmdlTm90Rm91bmQCFQAAAEV4Y2hhbmdlQWxyZWFkeUV4aXN0cwIHAAAATG9nRnVsbAIMAAAATG9nTWFsZm9ybWVkAhMAAABJbnZhbGlkQ29udHJhY3ROYW1lAgwAAABDb250cmFjdE9ubHkCEwAAAEludm9rZUNvbnRyYWN0RXJyb3ICFgAAAEludm9rZUNvbnRyYWN0Tm9SZXN1bHQCEwAAAEludm9rZVRyYW5zZmVyRXJyb3ICCwAAAFBhcnNlUGFyYW1zAgsAAABQYXJzZVJlc3VsdAIOAAAASW52YWxpZFRva2VuSWQCEQAAAEluc3VmZmljaWVudEZ1bmRzAgwAAABVbmF1dGhvcml6ZWQCFgAAAEluY29ycmVjdFRva2VuQ2NkUmF0aW8CDAAAAFRva2VuTm90Q2lzMgILAAAATm90T3BlcmF0b3ICEQAAAENhbGxlZEJ5QUNvbnRyYWN0Ag4AAABBbW91bnRUb29MYXJnZQIOAAAATWlzc2luZ0FjY291bnQCDwAAAE1pc3NpbmdDb250cmFjdAIRAAAATWlzc2luZ0VudHJ5cG9pbnQCDQAAAE1lc3NhZ2VGYWlsZWQCCwAAAExvZ2ljUmVqZWN0AAEAAAAGAAAAcmVhc29uCAQAAABUcmFwAhgAAABJbnN1ZmZpY2llbnRPdXRwdXRBbW91bnQCDwAAAEludmFsaWRSZXNlcnZlcwIA`;
export const PIXPEL_SWAP_CONTRACT_INFO = {
  contractName: "replica_swap4",
  schemaBuffer: Buffer.from(PIXPEL_SWAP_SCHEMA, "base64"),
};