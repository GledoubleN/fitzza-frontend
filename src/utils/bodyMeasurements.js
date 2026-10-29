const BODY_MEASUREMENT_LIMITS = {
  height: { label: '키', unit: 'cm', min: 100, max: 250 },
  weight: { label: '몸무게', unit: 'kg', min: 20, max: 300 },
  shoeSize: { label: '발사이즈', unit: 'mm', min: 150, max: 350 },
}

export const findBodyMeasurementRangeError = (field, value) => {
  if (value === '' || value == null) return ''

  const { label, unit, min, max } = BODY_MEASUREMENT_LIMITS[field]
  const number = Number(value)

  return number < min || number > max
    ? `${ label }는 ${ min }${ unit } ~ ${ max }${ unit } 사이로 입력해주세요.`
    : ''
}
