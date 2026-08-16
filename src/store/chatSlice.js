import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../lib/locals";
import { SOCKET_EVENTS } from "../utils/socket";

const initialState={
    newMessagesAlert:getOrSaveFromStorage({
        key:SOCKET_EVENTS.NEW_MESSAGE_ALERT,
        get:true
    }) ||[
        {
      communityId: "",
      count: 0,
    }
    ]
}

const chatSlice= createSlice({
  name:"community",
  initialState,
  reducers:{
    setNewMessagesAlert:(state,action)=>{
         const communityId = action.payload.communityId;
         const index = state.newMessagesAlert.findIndex(
        (item) => item.communityId === communityId
      );
         if (index !== -1) {
        state.newMessagesAlert[index].count += 1;
      } else {
        state.newMessagesAlert.push({
          communityId,
          count: 1,
        });
      }
    },
    removeNewMessagesAlert: (state, action) => {
      state.newMessagesAlert = state.newMessagesAlert.filter(
        (item) => item.communityId !== action.payload
      );
    },
  }
})

export default chatSlice;
export const {
  setNewMessagesAlert,
  removeNewMessagesAlert,
} = chatSlice.actions;