# CleanerBot

Project mon Nhap mon AI: mo phong robot hut bui tren web bang HTML, CSS va JavaScript thuan.

Project hien da cai dat BFS, DFS, IDS, A*, IDA* va Greedy.

## Cau truc project

```text
CleanerBot/
├── index.html
├── style.css
├── js/
│   ├── main.js
│   ├── models.js
│   ├── environment.js
│   ├── simulator.js
│   ├── render.js
│   └── algorithms/
│       ├── registry.js
│       ├── baseAlgorithm.js
│       ├── bfs.js
│       ├── ids.js
│       ├── astar.js
│       ├── idastar.js
│       └── greedy.js
└── README.md
```

## Cach chay

Cach khuyen nghi:

1. Cai Node.js neu may chua co.
2. Mo terminal tai thu muc project.
3. Chay `npm start`.
4. Mo `http://localhost:3000`.

Project dung mot server Node.js nho, khong can cai framework hay package ngoai. Server phuc vu giao dien va ghi cac map da luu vao file `data/saved-maps.json`.

Neu van mo giao dien bang Live Server, hay chay `npm start` song song. Giao dien se tu ket noi den API tai cong `3000` de Save/Load map.

Neu trang chi hien khung trang, dropdown rong, va stats van la `-`, gan nhu chac chan JavaScript module chua chay. Hay kiem tra Console cua trinh duyet va chay bang Live Server.

## Tuy chinh map

Panel Controls co cac input:

- `Map width`: so cot cua map
- `Map height`: so hang cua map
- `Trash`: so o rac duoc sinh ngau nhien
- `Obstacles`: so vat can duoc sinh ngau nhien
- `Max capacity`: so rac toi da robot co the mang
- `Max battery`: muc pin khoi tao va muc pin sau khi sac day
- `Battery loss`: so phan tram pin bi tru moi khi robot di chuyen 1 o

Sau khi sua thong so, bam `Generate map` de tao lai map. Charging station mac dinh o `(0, 0)`, trash can mac dinh o goc duoi phai cua map.

Panel Map Editor cho phep chinh tung o tren grid:

- `Inspect`: xem thong tin o
- `Empty`: xoa trash va obstacle tai o do
- `Trash`: them rac
- `Obstacle`: them vat can
- `Charging station`: chuyen tram sac den o do
- `Trash can`: chuyen thung rac den o do
- `Robot start`: chuyen robot den o do va cap nhat start position

Chon tool, sau do click vao o tren map. Khi simulator dang Run, editor tam thoi bi khoa. Map sau khi chinh bang editor se duoc luu lam moc moi cho nut `Reset map`.

### Luu va tai map

Khu vuc `Saved Maps` trong panel Map Editor cho phep luu cau hinh map vao trinh duyet:

1. Tao map hoac chinh map bang Map Editor.
2. Nhap ten vao `Map name`.
3. Bam `Save map`.
4. Chon map trong danh sach `Saved map` va bam `Load map` de tai lai.

Luu lai cung mot ten se cap nhat ban luu cu. Nut `Delete` xoa map dang chon. Du lieu nam trong `data/saved-maps.json`, vi vay co the commit file nay vao Git hoac copy ca project sang may khac.

Ban luu luon dung trang thai khoi dau cua map, khong luu tien do robot dang chay do.

Map hien thi cac doi tuong bang icon SVG trong `assets/icons/`. Neu muon doi sticker, chi can thay file SVG tuong ung:

- `robot.svg`
- `trash.svg`
- `obstacle.svg`
- `charger.svg`
- `trash-can.svg`

## Dieu khien simulator

- `Generate map`: sinh map ngau nhien moi theo thong so hien tai.
- `Reset map`: dua robot, trash, obstacle va cac tram ve lai trang thai ban dau cua map hien tai.
- `Previous Step`: quay lai trang thai truoc action gan nhat.
- `Next Step`: chay dung mot action tiep theo.
- `Run`: chay lien tuc.
- `Stop`: dung chay lien tuc.
- `Speed 1x/2x/3x/5x`: doi toc do khi chay lien tuc.

Panel `Action` hien:

- `Latest action`: action vua duoc gui vao environment.
- `Next action`: action simulator dang preview va se dung cho lan Next Step tiep theo.

## Mo hinh du lieu

Robot co cac thuoc tinh:

- `battery`
- `capacity`
- `maxCapacity`
- `x`
- `y`

Map co cac thuoc tinh:

- `grid_size_x`
- `grid_size_y`
- `start_x`
- `start_y`
- `trashPositions`
- `obstaclePositions`
- `chargingStation`
- `trashCan`
- `done`

Action nam trong `ACTIONS` tai `js/models.js`:

- `up`
- `down`
- `left`
- `right`
- `charge`
- `suck_trash`
- `let_trash_out`
- `stay`

## Cach them hoac sua thuat toan

Moi thuat toan nam trong mot file rieng tai `js/algorithms/` va export mot class rieng. Tat ca class nen ke thua `BaseAlgorithm`.

Interface can tuan thu:

```js
class YourAlgorithm extends BaseAlgorithm {
  constructor() {
    super();
    this.name = "Your Algorithm";
  }

  reset() {
    // Xoa trang thai noi bo cua thuat toan.
  }

  nextAction(state) {
    // Nhan state hien tai, tra ve mot ACTIONS.* hoac null.
  }
}
```

`state` gom:

- `state.robot`
- `state.map`
- `state.config`
- `state.steps`
- `state.latestLog`

Vi du action hop le:

```js
return ACTIONS.UP;
return ACTIONS.SUCK_TRASH;
return ACTIONS.STAY;
```

## Ghi chu ve thuat toan

Project hien co sau thuat toan:

- `bfs.js`: Breadth-First Search.
- `dfs.js`: Depth-First Search.
- `ids.js`: Iterative Deepening Search.
- `astar.js`: A*.
- `idastar.js`: IDA*.
- `greedy.js`: Greedy search.

BFS chua bo dieu phoi nghiep vu dung chung. DFS, IDS, A* va IDA* tai su dung bo dieu phoi nay va override phan tim duong. Greedy co cach dieu phoi va chon buoc rieng.

## Cach de dropdown tu nhan thuat toan moi

Vi project chay tren frontend tinh, trinh duyet khong the tu doc danh sach file trong thu muc `js/algorithms/`. Thay vao do, project dung `js/algorithms/registry.js` lam danh sach dang ky thuat toan.

Khi them mot thuat toan moi:

1. Tao file moi, vi du `js/algorithms/bfs.js`.
2. Export class thuat toan trong file do.
3. Them mot entry vao `algorithmRegistry`.

Vi du:

```js
{
  id: "bfs",
  label: "BFS",
  loadClass: () => import("./bfs.js").then((module) => module.BFSAlgorithm),
}
```

Sau do dropdown se tu hien BFS, khong can sua `index.html` hoac `main.js`.
