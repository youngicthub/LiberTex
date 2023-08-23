let data = [
  {
    image: "/images/nft/nft1.avif",
  },
  {
    image: "/images/nft/nft2.avif",
  },
  {
    image: "/images/nft/nft3.avif",
  },
  {
    image: "/images/nft/nft4.avif",
  },
  {
    image: "/images/nft/nft5.avif",
  },
  {
    image: "/images/nft/nft6.avif",
  },
  {
    image: "/images/nft/nft7.avif",
  },
  {
    image: "/images/nft/nft8.avif",
  },
  {
    image: "/images/nft/nft9.avif",
  },
  {
    image: "/images/nft/nft10.avif",
  },
  {
    image: "/images/nft/nft11.avif",
  },
  {
    image: "/images/nft/nft12.avif",
  },
  {
    image: "/images/nft/nft13.avif",
  },
  {
    image: "/images/nft/nft14.avif",
  },
  {
    image: "/images/nft/nft15.avif",
  },
  {
    image: "/images/nft/nft16.avif",
  },
  {
    image: "/images/nft/nft17.avif",
  },
  {
    image: "/images/nft/nft18.avif",
  },
  {
    image: "/images/nft/nft19.avif",
  },
  {
    image: "/images/nft/nft20.avif",
  },
  {
    image: "/images/nft/nft21.avif",
  },
  {
    image: "/images/nft/nft22.avif",
  },
  {
    image: "/images/nft/nft23.avif",
  },
];

let appendCollections = document.getElementById("appendCollections");
data = data.sort(() => Math.random() - 0.5);
data.map((cur) => {
  console.log(cur);
  appendCollections.innerHTML += `
  <div class="colelction_list">
  <a href="https://opensea.io/collection/y00ts-yacht-club" target="_black" >
  <img src="${cur.image}" alt="">
  </a>
  <div class="creator_name">
      <h6 style="color: black">Robotic ape</h6>
      <p><b>Price: </b> ${Math.random().toString().substr(3, 7)}</p>
  </div>
</div>
    `;
});
