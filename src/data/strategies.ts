import trieuBien from '../assets/trieu-bien.webp'
import coLenh from '../assets/co-lenh.webp'
import giaCo from '../assets/gia-co.webp'
import nghiBinh from '../assets/nghi-binh.webp'
import cocNgam from '../assets/coc-ngam.webp'
import doLuong from '../assets/do-luong.webp'
import maiPhuc from '../assets/mai-phuc.webp'

export type Strategy = {
  id: string
  name: string
  tag: string
  lines: { label?: string; text: string }[]
  image: string
  bg: string
  fg: string
}

export const strategies: Strategy[] = [
  {
    id: 'trieu-bien',
    name: 'Triều Biến',
    tag: 'Biến động',
    lines: [
      { label: 'Con nước đổi', text: 'Khi rút được lá bài này, Thủy triều tăng lên 1 mức.' },
      { text: 'Dự báo Dò con nước bị hủy.' },
      { text: 'Những lá Biến động đã xuất hiện được đặt trở lại trên đầu chồng rút.' },
    ],
    image: trieuBien,
    bg: '#2a7fd0',
    fg: '#ffffff',
  },
  {
    id: 'co-lenh',
    name: 'Cờ Lệnh',
    tag: 'Kế sách',
    lines: [
      { label: 'Kỹ năng 01', text: 'Chọn một hoặc nhiều nhân vật cùng ô và chuyển họ đến một ô còn tồn tại.' },
      { label: 'Hoặc · Kỹ năng 02', text: 'Sau khi đủ 4 kế sách và tất cả về Đại bản doanh, bỏ 1 Cờ lệnh để cả đội thắng. Không thể chuyển bài Cờ lệnh.' },
    ],
    image: coLenh,
    bg: '#ffb627',
    fg: '#231511',
  },
  {
    id: 'gia-co',
    name: 'Gia Cố',
    tag: 'Kế sách',
    lines: [
      {
        label: 'Dùng bất cứ khi nào',
        text: 'Chọn 1 ô Nguy cấp bất kỳ và lật sang mặt Ổn định. Không thể dùng nếu lá Biến động của ô đó vừa được lật và bị loại.',
      },
    ],
    image: giaCo,
    bg: '#a4499c',
    fg: '#ffffff',
  },
  {
    id: 'nghi-binh',
    name: 'Nghi Binh',
    tag: 'Kế sách',
    lines: [{ text: 'Thuyền trôi một ngả, quân đi một nẻo — địch nhìn mãi vẫn không rõ đâu là thật.' }],
    image: nghiBinh,
    bg: '#ea4f3d',
    fg: '#ffffff',
  },
  {
    id: 'coc-ngam',
    name: 'Cọc Ngầm',
    tag: 'Kế sách',
    lines: [{ text: 'Một hàng cọc nhọn chìm dưới nước, lặng lẽ chặn đường thế trận.' }],
    image: cocNgam,
    bg: '#f0a35e',
    fg: '#231511',
  },
  {
    id: 'do-luong',
    name: 'Dò Luồng',
    tag: 'Kế sách',
    lines: [{ text: 'Thọc sào xuống nước, dò đường sâu cạn trước khi cả đội rời bến.' }],
    image: doLuong,
    bg: '#1fb3aa',
    fg: '#231511',
  },
  {
    id: 'mai-phuc',
    name: 'Mai Phục',
    tag: 'Kế sách',
    lines: [{ text: 'Nấp sau lau lách ven sông, giương cung — chờ đúng một tiếng lệnh.' }],
    image: maiPhuc,
    bg: '#74c45d',
    fg: '#231511',
  },
]
