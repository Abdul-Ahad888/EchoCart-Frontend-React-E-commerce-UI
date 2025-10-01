import { jwtDecode } from 'jwt-decode'
import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, allowedRoles }) {

    const token = localStorage.getItem('authToken')

    const getUserRole = () => {
        if (!token) return null

        try {
            const decoded = jwtDecode(token)
            return decoded.role
        } catch (err) {
            console.log(err)
        }
    }

    if (!token) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(getUserRole())) {
        return <Navigate to="/" repalce />
    }

    return children
}

