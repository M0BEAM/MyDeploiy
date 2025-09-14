"use client";

import { useRouter, useSearchParams } from "next/navigation";


export default function Services() {
    const searchParams = useSearchParams()
    const projectId = searchParams.get("projectId"); // Extracts the subdomain

    const router = useRouter();
    const services = [
        {
            name: "Static Site",
            description: "Deploy fast and secure static websites with ease.",
            icon: (
                <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                    <div className="w-4 h-4 border-2 border-blue-600 rounded-sm"></div>
                </div>
            ),
            available: true,
        },
        {
            name: "Web Service",
            description: "Run dynamic backend services and APIs in the cloud.",
            icon: (
                <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center rounded-full">
                    <div className="w-4 h-4 border-t-2 border-b-2 border-green-600"></div>
                </div>
            ),
            available: true,
        },
        {
            name: "Other",
            description: "More deployment types coming soon.",
            icon: (
                <div className="w-10 h-10 bg-gray-200 text-gray-500 flex items-center justify-center rounded-full">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
                </div>
            ),
            available: false,
        },
    ];
    const handeleClickService = (serviceName: string) => {
        if (serviceName === "Static Site") {
            router.push("/dashboard/deploy/static/new?projectId=" + projectId);
        } else if (serviceName === "Web Service") {
            router.push("/dashboard/deploy/web/new?projectId=" + projectId);
        }
    }
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Choose a Service Type
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className={`border rounded-xl p-5 transition ${service.available
                            ? "bg-white hover:shadow-md cursor-pointer"
                            : "bg-gray-100 opacity-60 cursor-not-allowed"
                            }`}
                        onClick={() => handeleClickService(service.name)}
                    >
                        <div className="flex items-center gap-4 mb-3">
                            {service.icon}
                            <h3 className="text-xl font-semibold text-gray-700">{service.name}</h3>
                        </div>
                        <p className="text-gray-600 text-sm">{service.description}</p>
                        {!service.available && (
                            <span className="inline-block mt-3 text-xs text-yellow-500 font-medium">
                                Coming Soon
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
