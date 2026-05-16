import { useEffect, useState, useRef } from "react"
let initialgrid =[
                    [0, 0, 0, 0],
                    [2, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 2]
                  ]
export default function App(){
  const [grid, setGrid] = useState(initialgrid);
  const [isgameWon, setisGameWon] = useState(false)
  const [isgamefinish, setisgamefinish] = useState(false)
  function addNumber(grid){
    let empty = [];
    for(let i=0; i<4 ;i++){
      for(let j=0 ; j<4 ;j++){
        if (grid[i][j] == 0){
          empty.push([i,j])
        }
        if (grid[i][j]==2**11){
          setisgamefinish(true)
          setisGameWon(true)
        }
      }
    }
    if (empty.length==0){
      setisgamefinish(true)
      setisGameWon(false)
    }
    let random_index_of_empty_cell = Math.floor(Math.random()*empty.length)
    let [y, x] = empty[random_index_of_empty_cell]
    let arr = []
    for(let i=0; i<4 ;i++){
      arr[i] = []
      for(let j=0 ; j<4 ;j++){
        if(i==y && j==x){
          arr[i][j] = 2
        }else{
          arr[i][j] = grid[i][j]
        }
      }
    }
    return(arr)
  }
  function clockwise_rotation(grid){
    let rotated = []
    for (let i=0; i<4 ; i++){
      let row = [grid[0][i], grid[1][i], grid[2][i], grid[3][i]]
      rotated.push(row.reverse()) 
    }
    return (rotated)
  }
  function anticlockwise_rotation(grid){
    // console.log(grid)
    let rotated = []
    for(let i=0 ; i<4 ; i++){
      let row = [grid[0][3-i], grid[1][3-i], grid[2][3-i], grid[3][3-i]]
      rotated.push(row)
    }
    return (rotated)
  }
  function left_click(){
  let newgrid = [];
  for (let row = 0; row < 4; row++){
    let nums = grid[row].filter(num => num > 0);
    for (let i = 0; i < nums.length - 1; i++){
      if (nums[i] === nums[i + 1]){
        nums[i] *= 2;
        nums[i + 1] = 0;
        i++;
      }
    }
    nums = nums.filter(num => num > 0);
    while (nums.length < 4){
      nums.push(0);
    }
    newgrid.push(nums);
  }
  let finalgrid = addNumber(newgrid);
  setGrid(finalgrid);
}
  function right_click(){
    let newgrid = []
    for (let row=0 ; row<4 ; row++){
      let nums = grid[row].filter(num => num>0)
      if (nums.length == 0){
        nums.push(0)
      }
      for (let i=0 ; i<nums.length ; i++){
        if (nums[i]==nums[i+1]){
          // console.log(row)
          nums[i+1] = nums[i] * 2;
          nums[i] = 0
        }
        nums = nums.filter(num => num > 0)
        while (nums.length < 4){
        nums.unshift(0);
        }
      }
      newgrid.push(nums)
    }
    // console.log(newgrid)
    let finalgrid = addNumber(newgrid)
    setGrid(finalgrid)
  }
  function up_click(){
    // console.log(grid)
    let rotated = clockwise_rotation(grid);
    // console.log(rotated)
    // console.log(rotated)
    let newgrid = []
    for (let row=0 ; row<4 ; row++){
      let nums = rotated[row].filter(num => num>0)
      if (nums.length == 0){
        nums.push(0)
      }
      for (let i=0 ; i<nums.length ; i++){
        if (nums[i]==nums[i+1]){
          nums[i] = nums[i] * 2;
          nums[i+1] = 0
        }
      nums = nums.filter(num => num > 0)
      while (nums.length < 4){
        nums.unshift(0);
      }
      }
      newgrid.push(nums)
    }
    // console.log(newgrid)
    let ans = anticlockwise_rotation(newgrid)
    // console.log(ans)
    let finalgrid = addNumber(ans)
    setGrid(finalgrid)
  }
  function down_click(){
    let rotated = anticlockwise_rotation(grid)
    let newgrid = [];
    for (let row = 0; row < 4; row++){
      let nums = rotated[row].filter(num => num > 0);
      for (let i = 0; i < nums.length - 1; i++){
        if (nums[i] === nums[i + 1]){
          nums[i] *= 2;
          nums[i + 1] = 0;
          i++;
        }
      }
    nums = nums.filter(num => num > 0);
    while (nums.length < 4){
      nums.unshift(0);
    }
    newgrid.push(nums);
  }
    let ans = clockwise_rotation(newgrid)
    let finalgrid = addNumber(ans)
    setGrid(finalgrid)
  }
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }
  function restart(){
    setGrid(initialgrid)
    setisGameWon(false)
    setisgamefinish(false)
  }
  function handleTouchEnd(e) {
    let dx = e.changedTouches[0].clientX - touchStartX.current;
    let dy = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      dx > 0 ? right_click() : left_click();
    } else {
      dy > 0 ? down_click() : up_click();
    }
  }
  useEffect(()=>{
    function keypresscheck(e){
      switch (e.key){
        case "ArrowLeft":
          left_click();
          break;
        case "ArrowRight":
          right_click();
          break;
        case "ArrowDown":
          down_click();
          break;
        default:
          up_click();
          break;
      }
    }
    window.addEventListener("keydown", keypresscheck)
    return ()=> window.removeEventListener("keydown", keypresscheck)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[grid])
  return (
    <div className="game" onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd} >
    {!isgamefinish ?   <div><div className="grid">
    {grid.map((row,i)=>
      row.map((cell, j)=>{
        return <div className="cell" key={i-j}>{grid[i][j]==0?"":cell}</div>
      })
    )}
    </div>
    <div className="controls">
      <button onClick={left_click}>Left</button>
      <button onClick={right_click}>Right</button>
      <button onClick={up_click}>Up</button>
      <button onClick={down_click}>Down</button>
    </div> </div> : isgameWon ? <div><h1>Congratulations!! You have completed The Game 2048</h1><button onClick={restart} className="restart">Restart</button></div> : <div><h1>Oops! Better Luck Next Time</h1><button className="restart" onClick={restart}>Restart</button></div>}
    
    <div className="developer">
      Developer : <span>Blade</span>
    </div>
    </div>
  )
}