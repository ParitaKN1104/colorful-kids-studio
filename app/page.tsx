"use client";

import { useCallback, useEffect, useRef, useState } from "react";
type Picture = "rocket" | "butterfly" | "dino";
type SavedArt = { id: string; name: string; image: string; createdAt: string };
const colors = ["#ff5d73", "#ff9f1c", "#ffd93d", "#4dcc8a", "#34a6e8", "#7b61ff", "#ec65c1", "#5b3a29"];
const pictures: { id: Picture; name: string; emoji: string; hint: string }[] = [
  { id: "rocket", name: "จรวดตะลุยดาว", emoji: "🚀", hint: "ออกไปสำรวจจักรวาลกัน!" },
  { id: "butterfly", name: "ผีเสื้อในสวน", emoji: "🦋", hint: "แต่งปีกให้สดใสที่สุดเลย" },
  { id: "dino", name: "ไดโนเสาร์ใจดี", emoji: "🦕", hint: "เพื่อนตัวโตชอบสีอะไรนะ?" },
];
function drawTemplate(ctx: CanvasRenderingContext2D, picture: Picture) {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h); ctx.fillStyle = "#fffdf8"; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#25324b"; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.lineJoin = "round";
  if (picture === "rocket") {
    ctx.beginPath(); ctx.arc(90, 90, 28, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(690, 115, 16, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(400, 105); ctx.bezierCurveTo(310, 155, 300, 300, 400, 400); ctx.bezierCurveTo(500, 300, 490, 155, 400, 105); ctx.stroke();
    ctx.beginPath(); ctx.arc(400, 250, 45, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(330, 315); ctx.lineTo(255, 400); ctx.lineTo(345, 380); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(470, 315); ctx.lineTo(545, 400); ctx.lineTo(455, 380); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(370, 410); ctx.quadraticCurveTo(400, 500, 430, 410); ctx.stroke();
    [[145,220],[650,265],[120,450],[675,440]].forEach(([x,y])=>{ctx.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*4/5;ctx.lineTo(x+25*Math.cos(a),y+25*Math.sin(a));}ctx.closePath();ctx.stroke();});
  } else if (picture === "butterfly") {
    ctx.beginPath(); ctx.ellipse(400, 300, 30, 145, 0, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(382,170); ctx.quadraticCurveTo(335,105,300,120); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(418,170); ctx.quadraticCurveTo(465,105,500,120); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(370,215); ctx.bezierCurveTo(245,90,95,155,185,315); ctx.bezierCurveTo(90,390,245,495,375,370); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(430,215); ctx.bezierCurveTo(555,90,705,155,615,315); ctx.bezierCurveTo(710,390,555,495,425,370); ctx.stroke();
    [[255,245],[545,245],[255,365],[545,365]].forEach(([x,y],i)=>{ctx.beginPath();ctx.arc(x,y,i<2?34:24,0,Math.PI*2);ctx.stroke();});
    ctx.beginPath(); ctx.moveTo(70,500); ctx.quadraticCurveTo(400,440,730,500); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(145,385); ctx.bezierCurveTo(120,265,245,180,380,225); ctx.quadraticCurveTo(540,115,650,205); ctx.quadraticCurveTo(725,280,635,340); ctx.lineTo(560,342); ctx.quadraticCurveTo(520,425,425,420); ctx.lineTo(260,420); ctx.quadraticCurveTo(180,420,145,385); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(160,350); ctx.quadraticCurveTo(65,310,80,235); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(255,420); ctx.lineTo(235,485); ctx.lineTo(300,485); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(500,410); ctx.lineTo(520,485); ctx.lineTo(580,485); ctx.stroke();
    ctx.beginPath(); ctx.arc(615,245,7,0,Math.PI*2); ctx.fillStyle="#25324b"; ctx.fill();
    ctx.beginPath(); ctx.arc(665,300,16,0,Math.PI); ctx.stroke();
    [[270,215],[340,202],[410,215],[480,195]].forEach(([x,y])=>{ctx.beginPath();ctx.moveTo(x-20,y+8);ctx.lineTo(x,y-38);ctx.lineTo(x+22,y+8);ctx.stroke();});
    [[300,300],[420,335],[530,275]].forEach(([x,y])=>{ctx.beginPath();ctx.arc(x,y,22,0,Math.PI*2);ctx.stroke();});
  }
}
export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null); const [picture, setPicture] = useState<Picture>("rocket");
  const [color, setColor] = useState(colors[0]); const [size, setSize] = useState(18); const [drawing, setDrawing] = useState(false);
  const [saved, setSaved] = useState<SavedArt[]>([]); const [toast, setToast] = useState("");
  const reset = useCallback(() => { const c=canvasRef.current; if(c) drawTemplate(c.getContext("2d")!,picture); },[picture]);
  useEffect(()=>{reset();},[reset]); useEffect(()=>{try{setSaved(JSON.parse(localStorage.getItem("colorful-kids-art")||"[]"));}catch{}},[]);
  function point(e:React.PointerEvent<HTMLCanvasElement>){const c=canvasRef.current!,r=c.getBoundingClientRect();return{x:(e.clientX-r.left)*c.width/r.width,y:(e.clientY-r.top)*c.height/r.height};}
  function start(e:React.PointerEvent<HTMLCanvasElement>){e.currentTarget.setPointerCapture(e.pointerId);setDrawing(true);const p=point(e),x=e.currentTarget.getContext("2d")!;x.beginPath();x.moveTo(p.x,p.y);}
  function move(e:React.PointerEvent<HTMLCanvasElement>){if(!drawing)return;const p=point(e),x=e.currentTarget.getContext("2d")!;x.strokeStyle=color;x.lineWidth=size;x.lineCap="round";x.lineJoin="round";x.lineTo(p.x,p.y);x.stroke();}
  function saveArt(){const c=canvasRef.current!,item={id:`art-${Date.now()}-${Math.random().toString(16).slice(2)}`,name:pictures.find(p=>p.id===picture)!.name,image:c.toDataURL("image/png"),createdAt:new Date().toLocaleDateString("th-TH")};const next=[item,...saved];setSaved(next);localStorage.setItem("colorful-kids-art",JSON.stringify(next));setToast("เก็บเข้าคอลเลกชันแล้ว! ⭐");setTimeout(()=>setToast(""),2200);}
  function download(){const a=document.createElement("a");a.download=`my-${picture}.png`;a.href=canvasRef.current!.toDataURL("image/png");a.click();}
  function remove(id:string){const next=saved.filter(x=>x.id!==id);setSaved(next);localStorage.setItem("colorful-kids-art",JSON.stringify(next));}
  return <main><header className="topbar"><a className="brand" href="#top"><span>🎨</span> สีสนุก</a><nav><a href="#studio">ห้องระบายสี</a><a href="#collection">คอลเลกชัน <b>{saved.length}</b></a></nav></header>
    <section className="hero" id="top"><div className="hero-copy"><span className="eyebrow">โลกใบเล็กของศิลปินตัวจิ๋ว</span><h1>หยิบสีที่ชอบ<br/><em>แล้วปล่อยจินตนาการ</em></h1><p>เลือกภาพ ระบายให้สนุก และเก็บทุกผลงานแสนพิเศษไว้ในคอลเลกชันของหนู</p><a className="primary" href="#studio">เริ่มระบายสีกัน! <span>→</span></a></div><div className="hero-art" aria-hidden="true"><div className="sun">☀️</div><div className="rainbow">🌈</div><div className="cloud c1">☁️</div><div className="cloud c2">☁️</div><div className="pencil">✏️</div><div className="star s1">★</div><div className="star s2">★</div></div></section>
    <section className="studio" id="studio"><div className="section-title"><span>1</span><div><h2>เลือกภาพที่อยากระบาย</h2><p>วันนี้หนูอยากสร้างโลกแบบไหนดี?</p></div></div><div className="picture-grid">{pictures.map(p=><button key={p.id} className={picture===p.id?"picture-card active":"picture-card"} onClick={()=>setPicture(p.id)}><span>{p.emoji}</span><div><strong>{p.name}</strong><small>{p.hint}</small></div><i>{picture===p.id?"✓":"→"}</i></button>)}</div>
      <div className="workspace"><aside><h3>เลือกสี</h3><div className="palette">{colors.map(c=><button key={c} aria-label={`เลือกสี ${c}`} className={color===c?"swatch active":"swatch"} style={{background:c}} onClick={()=>setColor(c)}/>)}</div><label>ขนาดพู่กัน <b>{size}</b></label><input type="range" min="5" max="42" value={size} onChange={e=>setSize(+e.target.value)}/><div className="tools"><button onClick={reset}>↻ เริ่มใหม่</button><button onClick={download}>⇩ ดาวน์โหลด</button></div><button className="save" onClick={saveArt}>♥ เก็บในคอลเลกชัน</button></aside><div className="canvas-wrap"><div className="tape t1"/><div className="tape t2"/><canvas ref={canvasRef} width="800" height="560" onPointerDown={start} onPointerMove={move} onPointerUp={()=>setDrawing(false)} onPointerCancel={()=>setDrawing(false)} aria-label="พื้นที่ระบายสี"/></div></div></section>
    <section className="collection" id="collection"><div className="section-title"><span>2</span><div><h2>คอลเลกชันของฉัน</h2><p>ผลงานทั้งหมดจะเก็บไว้ในอุปกรณ์เครื่องนี้</p></div></div>{saved.length===0?<div className="empty"><span>🖼️</span><h3>พื้นที่รอผลงานชิ้นแรก</h3><p>ระบายสีด้านบน แล้วกด “เก็บในคอลเลกชัน” นะ</p></div>:<div className="gallery">{saved.map(x=><article key={x.id}><img src={x.image} alt={x.name}/><div><h3>{x.name}</h3><small>{x.createdAt}</small><button onClick={()=>remove(x.id)} aria-label={`ลบ ${x.name}`}>×</button></div></article>)}</div>}</section>
    <footer><span>🎨 สีสนุก</span><p>ทุกภาพสวยได้ เพราะเป็นภาพที่หนูตั้งใจทำ ♡</p></footer>{toast&&<div className="toast">{toast}</div>}</main>;
}
