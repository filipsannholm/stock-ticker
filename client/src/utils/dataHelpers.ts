export const getIdFromStockKey = (key: string) => {
    const id = key.match(/\w+-(\w+)/)
    return id && id[1] ? id[1] : ''
}

export const getStockKeyFromId = (id: string, market: string) => {
    return `${market.toLocaleLowerCase()}-${id.toLowerCase()}`
}

export const generateRGBString = () => {
    const rndm = () => Math.floor(Math.random() * 255);
    return `rgba(${rndm()}, ${rndm()}, ${rndm()}, 0.7)`;
  };
  