import Image from "next/image";

const StartupTestimonial = () => {
  return (
    <div className="mx-auto max-w-2xl py-40 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="bg-image-what">
        <h3 className="text-navyblue text-center text-4xl lg:text-6xl font-semibold">
          What startups say about us.
        </h3>
        <h4 className="text-lg font-normal text-darkgray text-center mt-4">
          Early-stage teams rely on our platform to launch fast, deploy securely, and
          scale effortlessly — without infrastructure overhead.
        </h4>

        <div className="lg:relative mt-10">
          <Image
            src="/assets/clientsay/avatars.png"
            alt="avatars"
            width={1061}
            height={733}
            className="hidden lg:block"
          />

          <span className="lg:absolute lg:bottom-40 lg:left-80">
            <Image
              src="/assets/clientsay/user.png"
              alt="startup founder"
              width={168}
              height={168}
              className="mx-auto pt-10 lg:pb-10"
            />
            <div className="lg:inline-block bg-white rounded-2xl p-5 shadow-sm max-w-md">
              <p className="text-base font-normal text-center text-darkgray">
                “We saved weeks of DevOps work. The platform let us deploy our web
                services, static sites, and CI/CD workflows — all in one place.”
              </p>
              <h3 className="text-2xl font-medium text-center py-2">Sara El Amine</h3>
              <h4 className="text-sm font-normal text-center">Startup Co-Founder</h4>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default StartupTestimonial;
