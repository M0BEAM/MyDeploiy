import Image from "next/image";

interface WhyData {
  heading: string;
  subheading: string;
}

const whydata: WhyData[] = [
  {
    heading: "Project Roles",
    subheading:
      "Define roles and permissions to organize teams and control access efficiently.",
  },
  {
    heading: "Secure & Scalable",
    subheading:
      "Isolate environments, manage secrets, and scale services independently with containers.",
  },
  {
    heading: "Developer-Centric",
    subheading:
      "Instant logs, CLI tooling, and Git-based workflows — built for modern teams.",
  },
];

const Why = () => {
  return (
    <div id="about">
      <div className="mx-auto max-w-7xl px-4 my-20 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* COLUMN-1 */}
          <div className="flex justify-center lg:justify-start">
            <Image
              src="/assets/why/iPad.png"
              alt="Deployment Dashboard"
              width={4000}
              height={900}
              className="max-w-full h-auto lg:-ml-64"
            />
          </div>

          {/* COLUMN-2 */}
          <div>
            <h3 className="text-4xl lg:text-5xl pt-4 font-semibold sm:leading-tight mt-5 text-center lg:text-start">
              Why choose our platform?
            </h3>
            <h4 className="text-lg pt-4 font-normal sm:leading-tight text-center text-beach lg:text-start">
              Don’t waste time on manual processes. Let automation handle builds,
              deployments, and monitoring so you can focus on building.
            </h4>

            <div className="mt-10">
              {whydata.map((item, i) => (
                <div className="flex mt-4" key={i}>
                  <div className="rounded-full h-10 w-12 flex items-center justify-center bg-circlebg">
                    <Image
                      src="/assets/why/check.svg"
                      alt="check"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="ml-5">
                    <h4 className="text-2xl font-semibold">{item.heading}</h4>
                    <h5 className="text-lg text-beach font-normal mt-2">
                      {item.subheading}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Why;
