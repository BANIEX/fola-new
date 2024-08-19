const _ = {
  "Login": "Login",
  get ["Login:Subtitle"]() { return `Login to ${this["Meta:StoreName"]}, to access cart products and more.`},
  "Sign Up": "Create an account",
  get ["Sign Up:Subtitle"]() { return `Sign up to ${this["Meta:StoreName"]}, to access cart products and more.`},
  "Meta:StoreName": "RanForte",
  "Meta:StoreTagline": "Get Ready to Rock Your Threads - Join the Fashion Party!",
  get ["Index:Hero:Heading"]() { return this["Meta:StoreName"]},
  "Index:Hero:Subtitle": "Redefine Your Shopping Experience at Ranforte: Where Quality Meets Convenience",
}
export default _;