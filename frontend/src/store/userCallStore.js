import { create } from "zustand";
import userChatStore from "./userChatStore";

const userCallStore = create((set, get) => ({
  incomingCall: [],
  outGoingCall: null,

  setOutgoingCall: (d) => {
    const outGoingCall = get().outGoingCall;
    if (!outGoingCall) {
      set({ outGoingCall: d });
    }
  },

  socketIncomingCall: (d) => {
    set({ incomingCall: [...get().incomingCall, d] });
  },

  allowedToRing: false,
  setAllowedToRing: (d) => set({ allowedToRing: d }),

  acceptedCall: null,
  setAcceptedCall: (d) => {
    const allIncomingCalls = get().incomingCall;
    const allConversations = userChatStore.getState().conversations;

    const findConversation = allConversations.find(
      (convo) => convo._id === d.conversationId
    );

    userChatStore.setState({
      convoSelected: findConversation,
      renderDisplayUser: null,
    });

    const filteredCalls = allIncomingCalls.filter((p) => p.tempId !== d.tempId);
    set({ acceptedCall: d, incomingCall: filteredCalls, allowedToRing: false });
  },

  showVideoRequest: null,
  setShowVideoRequest: (d) => set({ showVideoRequest: d }),
}));

export default userCallStore;
