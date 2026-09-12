import { Laptop } from '../data/laptops';

interface BatteryComparisonProps {
  laptops: Laptop[];
}

export default function BatteryComparison({ laptops }: BatteryComparisonProps) {
  const extractBatterySpec = (laptop: Laptop, key: string): string => {
    const batteryGroup = laptop.specs.find(s => s.title === 'باتری و شارژ');
    if (!batteryGroup) return '—';

    const row = batteryGroup.rows.find(r => r[0] === key);
    return row ? row[1] : '—';
  };

  const getCapacity = (laptop: Laptop): string => {
    const capacity = extractBatterySpec(laptop, 'ظرفیت باتری');
    const match = capacity.match(/(\d+)/);
    return match ? `${match[1]} Wh` : '—';
  };

  const getBatteryType = (laptop: Laptop): string => {
    const type = extractBatterySpec(laptop, 'نوع باتری');
    if (type.includes('Li-Po') || type.includes('لیتیوم پلیمر')) return 'Li Po';
    if (type.includes('Li-Ion') || type.includes('لیتیوم یون')) return 'Li Ion';
    return '—';
  };

  const getReplaceable = (laptop: Laptop): string => {
    const replaceable = extractBatterySpec(laptop, 'قابلیت تعویض');
    if (replaceable.includes('بله') || replaceable.includes('قابل تعویض')) return 'Yes';
    if (replaceable.includes('خیر') || replaceable.includes('غیرقابل') || replaceable.includes('لحیم')) return 'No';
    return '—';
  };

  const getFastCharging = (laptop: Laptop): string => {
    const fastCharging = extractBatterySpec(laptop, 'شارژ سریع');
    if (fastCharging.includes('بله') || fastCharging.includes('دارد')) return 'Yes';
    if (fastCharging.includes('خیر') || fastCharging.includes('ندارد')) return 'No';
    return '—';
  };

  const getUsbCharging = (laptop: Laptop): string => {
    const usbCharging = extractBatterySpec(laptop, 'شارژ از طریق USB');
    const match = usbCharging.match(/(\d+)\s*W/i);
    if (match) return `Yes, ${match[1]} W`;
    if (usbCharging.includes('بله') || usbCharging.includes('دارد')) return 'Yes';
    if (usbCharging.includes('خیر') || usbCharging.includes('ندارد')) return 'No';
    return '—';
  };

  const getChargingPortPosition = (laptop: Laptop): string => {
    const position = extractBatterySpec(laptop, 'موقعیت پورت شارژ');
    if (position.includes('چپ') || position.includes('Left')) return 'Left';
    if (position.includes('راست') || position.includes('Right')) return 'Right';
    return '—';
  };

  const getChargePower = (laptop: Laptop): string => {
    const power = extractBatterySpec(laptop, 'توان شارژر');
    const match = power.match(/(\d+)\s*W/i);
    return match ? `${match[1]} W` : '—';
  };

  // Determine best values for highlighting
  const capacities = laptops.map(getCapacity);
  const usbChargingValues = laptops.map(getUsbCharging);
  const chargePowers = laptops.map(getChargePower);

  const bestCapacity = capacities.reduce((best, curr) => {
    const bestVal = parseInt(best);
    const currVal = parseInt(curr);
    return currVal > bestVal ? curr : best;
  }, '0');

  const bestChargePower = chargePowers.reduce((best, curr) => {
    const bestVal = parseInt(best);
    const currVal = parseInt(curr);
    return currVal > bestVal ? curr : best;
  }, '0');

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
        <svg width={20} height={20} viewBox="0 0 24 24" fill="#1a73e8">
          <rect x="2" y="7" width="18" height="10" rx="1" />
          <rect x="20" y="10" width="2" height="4" />
        </svg>
        <span className="text-[18px] font-bold text-[#1a1a2e]">Battery</span>
      </div>

      {/* Capacity Row with Radio Buttons */}
      <div className="grid grid-cols-3 border-b border-[#e8e8e8]" style={{ minHeight: '40px' }}>
        <div className="col-span-1 flex items-center px-4 py-3 text-[14px] text-[#666666]">
          Capacity
        </div>
        {laptops.map((laptop, idx) => (
          <div key={laptop.id} className="col-span-1 flex items-center px-4 py-3">
            <div className="h-4 w-4 rounded-full bg-[#1a73e8] mr-2" />
            <span className="text-[14px] text-[#1a73e8]">{getCapacity(laptop)}</span>
          </div>
        ))}
      </div>

      {/* Battery Type */}
      <div className="grid grid-cols-3 border-b border-[#e8e8e8]" style={{ minHeight: '40px' }}>
        <div className="col-span-1 flex items-center px-4 py-3 text-[14px] text-[#666666]">
          Battery type
        </div>
        {laptops.map((laptop) => (
          <div key={laptop.id} className="col-span-1 flex items-center px-4 py-3 text-[14px] text-[#333333]">
            {getBatteryType(laptop)}
          </div>
        ))}
      </div>

      {/* Replaceable */}
      <div className="grid grid-cols-3 border-b border-[#e8e8e8]" style={{ minHeight: '40px' }}>
        <div className="col-span-1 flex items-center px-4 py-3 text-[14px] text-[#666666]">
          Replaceable
        </div>
        {laptops.map((laptop) => (
          <div key={laptop.id} className="col-span-1 flex items-center px-4 py-3 text-[14px] text-[#333333]">
            {getReplaceable(laptop)}
          </div>
        ))}
      </div>

      {/* Fast Charging */}
      <div className="grid grid-cols-3 border-b border-[#e8e8e8]" style={{ minHeight: '40px' }}>
        <div className="col-span-1 flex items-center px-4 py-3 text-[14px] text-[#666666]">
          Fast charging
        </div>
        {laptops.map((laptop) => (
          <div key={laptop.id} className="col-span-1 flex items-center px-4 py-3 text-[14px] text-[#333333]">
            {getFastCharging(laptop)}
          </div>
        ))}
      </div>

      {/* Charging via USB (Power Delivery) */}
      <div className="grid grid-cols-3 border-b border-[#e8e8e8]" style={{ minHeight: '40px' }}>
        <div className="col-span-1 flex items-center px-4 py-3 text-[14px] text-[#666666]">
          <div>
            <div>Charging via USB (Power</div>
            <div>Delivery)</div>
          </div>
        </div>
        {laptops.map((laptop, idx) => {
          const value = getUsbCharging(laptop);
          const isBest = value === bestCapacity && value.includes('W');
          return (
            <div
              key={laptop.id}
              className={`col-span-1 flex items-center px-4 py-3 text-[14px] ${
                isBest ? 'bg-[#d4edda] text-[#333333]' : 'text-[#333333]'
              }`}
            >
              {value}
            </div>
          );
        })}
      </div>

      {/* Charging Port Position */}
      <div className="grid grid-cols-3 border-b border-[#e8e8e8]" style={{ minHeight: '40px' }}>
        <div className="col-span-1 flex items-center px-4 py-3 text-[14px] text-[#666666]">
          Charging port position
        </div>
        {laptops.map((laptop) => (
          <div key={laptop.id} className="col-span-1 flex items-center px-4 py-3 text-[14px] text-[#333333]">
            {getChargingPortPosition(laptop)}
          </div>
        ))}
      </div>

      {/* Charge Power */}
      <div className="grid grid-cols-3" style={{ minHeight: '40px' }}>
        <div className="col-span-1 flex items-center px-4 py-3 text-[14px] text-[#666666]">
          Charge power
        </div>
        {laptops.map((laptop, idx) => {
          const value = getChargePower(laptop);
          const isBest = value === bestChargePower && value !== '—';
          return (
            <div
              key={laptop.id}
              className={`col-span-1 flex items-center px-4 py-3 text-[14px] ${
                isBest ? 'bg-[#d4edda] text-[#333333]' : 'text-[#333333]'
              }`}
            >
              {value}
            </div>
          );
        })}
      </div>
    </div>
  );
}
