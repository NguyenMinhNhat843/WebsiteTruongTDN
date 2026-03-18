import { MapPin } from "lucide-react";

const DiaChi = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="">
        {/* Bản đồ Google Maps */}
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-blue-100">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.711847671746!2d109.19062367584558!3d12.253904930335011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31706798020d57e3%3A0x67343e8a14e91b5c!2zMjUgTMOqIEzhu6NpLCBW4bqhbiBUaOG6pW5oLCBOaGEgVHJhbmcsIEtow6FuaCBIw7JhIDY1MDAwMCwgVmlldG5hbQ!5e0!3m2!1svi!2s!4v1709700000000!5m2!1svi!2s"
            className="w-full h-full"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Thông tin địa chỉ chi tiết */}
        <div className="pt-4 h-full flex flex-col justify-center">
          <div className="p-6 rounded-2xl bg-blue-900 text-white shadow-lg border-b-4 border-blue-600">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl shrink-0">
                <MapPin size={28} className="text-blue-300" />
              </div>
              <div>
                <p className="text-xs text-blue-200 uppercase font-bold tracking-widest mb-1">
                  Cơ sở chính
                </p>
                <h3 className="text-lg font-semibold mb-2">
                  Trường TC Kinh tế Kỹ thuật Trần Đại Nghĩa
                </h3>
                <p className="text-sm text-blue-50 leading-relaxed opacity-90">
                  25 Lê Lợi, Phường Vạn Thạnh, TP. Nha Trang, tỉnh Khánh Hòa
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaChi;
