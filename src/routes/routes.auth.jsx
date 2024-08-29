import { React } from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import { SignUp } from "../pages/SignUp"

export function RoutesAuth() {
    const user = sessionStorage.getItem("@portapalete:user")

    return (
        <Routes>
            <Route path="/" element={<SignUp />}/>

            {!user && <Route path="*" element={< Navigate to="/" />}/>}
        </Routes>
    );
}