"use client"

import { Layout } from "@/components/custom/layout"

export default function Profile() {
    return (
        <Layout>
            <Layout.Header sticky>
                <div>Layout Header</div>
            </Layout.Header>
            <Layout.Body>
                <div>
                    Profile
                </div>
            </Layout.Body>
        </Layout>
    )
}