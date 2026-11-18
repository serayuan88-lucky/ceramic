/* ============================================================
   EDIT YOUR SHOP HERE
   - instagram: your handle (no @)
   - Each piece: id (unique), name, type, price (€), size, glaze,
     stock (number left; 0 = sold out), desc,
     photo: path to your photo in the images folder,
     e.g. "images/nuria-mug.jpg" (leave "" to show the drawing)
   - type must be one of: mug, cup, bowl, plate, vase
   ============================================================ */
const SHOP = { name: "Sera Ceramics", instagram: "seralucky" };

const PIECES = [
  { id:"nuria-mug", name:"Núria Mug", type:"mug", price:32, size:"350 ml", glaze:"#2440A8", clay:"#C9B79C", stock:3, desc:"A lake-blue mug inspired by Vall de Núria. Cobalt glaze breaking over speckled stoneware.", photo:"" },
  { id:"capferret-mug", name:"Cap-Ferret Mug", type:"mug", price:32, size:"350 ml", glaze:"#7FB3A8", clay:"#D6C6AC", stock:2, desc:"Sea-foam glaze with a raw sandy base. Made after a week by the Atlantic.", photo:"" },
  { id:"vic-cup", name:"Vic Morning Cup", type:"cup", price:24, size:"250 ml", glaze:"#E4DCCB", clay:"#B49A7A", stock:5, desc:"Handle-less cup in speckled oat glaze. Fits perfectly in two hands.", photo:"" },
  { id:"ribes-espresso", name:"Ribes Espresso Pair", type:"cup", price:30, size:"2 × 90 ml", glaze:"#3A3F4A", clay:"#C9B79C", stock:1, desc:"Set of two espresso cups in charcoal satin glaze.", photo:"" },
  { id:"pyrenees-bowl", name:"Pyrenees Bowl", type:"bowl", price:28, size:"Ø 15 cm", glaze:"#A9C2A0", clay:"#CDBA9C", stock:4, desc:"Celadon green bowl for breakfast, salads or post-training smoothie bowls.", photo:"" },
  { id:"swim-bowl", name:"Post-Swim Ramen Bowl", type:"bowl", price:38, size:"Ø 19 cm", glaze:"#1E3366", clay:"#C2AE90", stock:0, desc:"Deep blue, deep bowl. For big appetites after a long swim.", photo:"" },
  { id:"bordeaux-tumbler", name:"Bordeaux Tumbler", type:"cup", price:26, size:"200 ml", glaze:"#6E2436", clay:"#CDBA9C", stock:4, desc:"Wine-red tumbler for vino, water or flowers.", photo:"" },
  { id:"small-plate", name:"Side Plate", type:"plate", price:22, size:"Ø 18 cm", glaze:"#DCE3E6", clay:"#BFA888", stock:6, desc:"Pale blue-white side plate with a raw clay rim.", photo:"" },
  { id:"dinner-plate", name:"Dinner Plate", type:"plate", price:36, size:"Ø 26 cm", glaze:"#2440A8", clay:"#C9B79C", stock:1, desc:"Cobalt dinner plate, glossy centre and matte edge.", photo:"" },
  { id:"bud-vase", name:"Bud Vase", type:"vase", price:29, size:"12 cm tall", glaze:"#D9A441", clay:"#C9B79C", stock:3, desc:"Small vase for a single stem. Honey amber glaze.", photo:"" },
  { id:"tall-vase", name:"Tall Bottle Vase", type:"vase", price:58, size:"28 cm tall", glaze:"#4E6B5C", clay:"#BFA888", stock:1, desc:"Statement bottle vase in forest green with a long drip.", photo:"" },
  { id:"seconds-mug", name:"Seconds Mug", type:"mug", price:18, size:"300 ml", glaze:"#8FA3C9", clay:"#C9B79C", stock:2, desc:"A small glaze imperfection, same love. Fully functional and food safe.", photo:"" }
];
