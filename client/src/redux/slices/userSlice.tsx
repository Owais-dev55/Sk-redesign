"use client"
import { createSlice , PayloadAction } from "@reduxjs/toolkit"

export interface User {
    _id: string
    name:string
    role: "ADMIN" | "DOCTOR" | "PATIENT"
    image?: string;
}


interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    setUser(state, action: PayloadAction<User | null>) {
    state.user = action.payload;
    },
     clearUser(state) {
      state.user = null;
    },
    }
})

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;