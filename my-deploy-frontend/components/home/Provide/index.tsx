import Link from "next/link";
import { JSX } from "react";

interface ServiceType {
  title: string;
  description: string;
  icon: JSX.Element;
}

const services: ServiceType[] = [
  {
    title: "Git Integration",
    description: "Deploy directly from GitHub, GitLab, or self-hosted repositories.",
    icon: (
      <svg className="w-10 h-10 text-blue mb-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.4 0 0 5.3 0 12c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.7 1.4.7 1.4.7 1.3 2.2.9 2.7.7.1-.5.4-.9.7-1.2-2.7-.3-5.6-1.3-5.6-6 0-1.3.5-2.3 1.2-3.1-.1-.3-.6-1.7.1-3.5 0 0 1-.3 3.3 1.2.9-.3 1.9-.5 2.9-.5s2 .2 2.9.5c2.2-1.5 3.2-1.2 3.2-1.2.7 1.8.3 3.2.1 3.5.7.8 1.2 1.8 1.2 3.1 0 4.7-2.9 5.6-5.6 6 .4.3.7.9.7 1.8v2.6c0 .3.2.7.8.6C20.6 21.8 24 17.3 24 12c0-6.7-5.4-12-12-12z" />
      </svg>
    ),
  },
  {
    title: "Docker Deployments",
    description: "Build and run containerized services securely and efficiently.",
    icon: (
      <svg className="w-10 h-10 text-blue mb-5" fill="currentColor" viewBox="0 0 32 32">
        <path d="M30.5 13.8c-.2-.1-1.4-.6-3-.4-.3-1.6-1.4-2.6-2.2-3.1-.7-.4-1.5-.6-2.2-.6h-.6c-.4 0-.8.3-.8.7s.3.7.8.7h.6c.4 0 .9.1 1.4.4.5.3 1.2.9 1.4 2.1l.1.6h.6c.7 0 1.2.1 1.5.1-1.3 4.4-6.2 8.7-12.8 8.7-3.1 0-6-.8-8.2-2.3-.5-.3-1.2-.9-1.6-1.5h19.2c.4 0 .8-.3.8-.7s-.3-.7-.8-.7H2.9c0-.1 0-.2-.1-.4 0-.2 0-.3-.1-.5h6.3c.4 0 .8-.3.8-.7s-.3-.7-.8-.7H2.5c.2-.7.6-1.3.9-1.7l.2-.2.1-.1H8c.4 0 .8-.3.8-.7s-.3-.7-.8-.7H4.9c.7-.7 1.3-1.1 1.7-1.3l.4-.2c.2-.1.3-.3.3-.6 0-.4-.3-.7-.8-.7h-.2C3.9 8.8 2.5 12 2 13.7c-.6 2.1-.5 4.1.2 6 .6 1.5 1.6 2.9 3 4.1C8.3 26.7 12.1 28 16 28c8.5 0 14.1-6.2 14.8-12.6.1-.4-.1-.7-.3-.8zM9.1 10.9h2.2v2.2H9.1v-2.2zm0-3.2h2.2v2.2H9.1V7.7zm3.2 3.2h2.2v2.2h-2.2v-2.2zm0-3.2h2.2v2.2h-2.2V7.7zm3.2 3.2h2.2v2.2h-2.2v-2.2zm0-3.2h2.2v2.2h-2.2V7.7zm3.2 3.2h2.2v2.2h-2.2v-2.2z" />
      </svg>
    ),
  },
  {
    title: "Environment Management",
    description: "Add encrypted environment variables per deployment.",
    icon: (
      <svg className="w-10 h-10 text-blue mb-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 1a7 7 0 00-7 7v2H3v12h18V10h-2V8a7 7 0 00-7-7zm-5 7a5 5 0 1110 0v2H7V8zm10 4v6H7v-6h10z" />
      </svg>
    ),
  },
  {
    title: "Live Logs and Monitoring",
    description: "Monitor builds, view real-time logs, and track deployments.",
    icon: (
      <svg className="w-10 h-10 text-blue mb-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 5a2 2 0 012-2h14a2 2 0 012 2v3H3V5zm0 5h18v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9zm6 3v4h2v-4H9zm4 0v4h2v-4h-2z" />
      </svg>
    ),
  },
];

const Provide = () => {
  return (
    <div id="services">
      <div className="mx-auto max-w-7xl px-4 my-10 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* COLUMN-1 */}
          <div className="col-span-6 flex justify-center">
            <div className="flex flex-col align-middle justify-center p-10">
              <p className="text-4xl lg:text-6xl pt-4 font-semibold lh-81 mt-5 text-center lg:text-start">
                Power your deployments, your way.
              </p>
              <h4 className="text-lg pt-4 font-normal lh-33 text-center lg:text-start text-bluegray">
                Our platform helps you deploy static sites, web services, and containers — with full control, secure environments, and live deployment insights.
              </h4>
              <Link
                href={"/docs"}
                className="mt-4 text-xl font-medium text-blue flex gap-2 mx-auto lg:mx-0 space-links"
              >
                Learn more
                <svg className="w-5 h-5 text-blue" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 5l7 7-7 7M5 12h14" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1" />

          {/* COLUMN-2 */}
          <div className="col-span-6 lg:col-span-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-10 lg:gap-x-40 px-10 py-12 bg-bluebg rounded-3xl">
              {services.map((item, i) => (
                <div key={i} className="bg-white rounded-3xl lg:-ml-32 p-6 shadow-xl">
                  {item.icon}
                  <h4 className="text-2xl font-semibold">{item.title}</h4>
                  <h4 className="text-lg font-normal text-bluegray my-2">{item.description}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Provide;
