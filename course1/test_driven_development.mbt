// Question: You can exchange `num_exchange` empty bottles for a bottle of water from a shop.
// 问题：每`num_exchange`个空瓶子，可以从商店换来一瓶水
//
// You have `num_bottles` bottles of water at the beginning.  
// How many bottles of water can you drink at most?
// 你最初拥有`num_bottles`瓶水，最多能喝几瓶水？
fn num_water_bottles(num_bottles : Int, num_exchange : Int) -> Int {
  for num_full = num_bottles, num_empty = 0, num_total = 0 {
    if num_full > 0 {
      continue 0, num_empty + num_full, num_total + num_full
    } else if num_empty >= num_exchange {
      continue num_empty / num_exchange, num_empty % num_exchange, num_total
    } else {
      break num_total
    }
  }
}

// We recommend the test driven development
// 我们推荐测试驱动的开发
test {
  assert_eq(num_water_bottles(9, 3), 13) // 9 + 3 + 1 = 13
  assert_eq(num_water_bottles(15, 4), 19)
}