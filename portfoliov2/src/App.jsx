import DataImage from "./data"

function App() {
  return (
    <>
     <div className="hero grid pt-15 grid-cols-1 md:grid-cols-2 lg:gap-10">
      <div>
        <div className="flex items-center gap-4 bg-zinc-800/50 w-fit p-4 rounded-2xl mb-5">
          <img src={DataImage.HeroImage} alt="Hero Image" className="w-10 rounded-md"/>
          <q>Lorem ipsum dolor sit amet.</q>
        </div>
        <h1 className="text-5xl/tight font-bold mb-5">Lorem, ipsum dolor.</h1>
        <p className="text-base/loose mb-6 opacity-50">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, natus explicabo tenetur facere aperiam minima consequatur iusto officia corrupti distinctio a voluptatibus quibusdam doloremque, quas maiores doloribus, neque id placeat!
        Enim nobis eveniet commodi, provident error reiciendis nihil? Exercitationem vel, quo eaque eius ipsa dolorum sapiente excepturi error fugit soluta, aperiam harum numquam beatae perferendis, eum cumque iste. Quaerat, aut!
        Molestiae itaque soluta sed sit, facere neque atque omnis harum doloribus amet tempore cum veritatis consequatur alias provident ipsa minus! Facilis sapiente aliquid quis animi corporis voluptates odit in a!
        </p>
        <div className="flex items-center gap-4">
          <a href="#" className="bg-violet-700/50 p-4 rounded-2xl hover:bg-violet-500/50">Download <i className="ri-download-line ri-lg"></i></a>
          <a href="#" className="bg-zinc-700/50 p-4 rounded-2xl hover:bg-zinc-500/50">Project <i className="ri-arrow-down-circle-line ri-lg"></i></a>
        </div>
      </div>
      <img src={DataImage.HeroImage} alt="Hero Image" className="w-[500px] mt-10 md:mt-0 ml-auto"/>
     </div>
    </>
  );
}

export default App;
