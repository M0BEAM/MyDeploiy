import Banner from "@/components/home/Banner/Banner";
import Clientsay from "@/components/home/Clientsay";
import Navbar from "@/components/home/Navbar/Navbar";
import Newsletter from "@/components/home/Newsletter/Newsletter";
import Provide from "@/components/home/Provide";
import Why from "@/components/home/Why";
import Footer from "@/components/home/Footer/Footer";



export default function Home() {
  return (
    <main>
      <Navbar />
      <Banner />
      
      {/* <Companies />
      <Buyers /> */}

      <Provide />
      <Why />

      {/* <Network /> */}

      <Clientsay />
      <Newsletter />
      <Footer />
    </main>
  )
}
