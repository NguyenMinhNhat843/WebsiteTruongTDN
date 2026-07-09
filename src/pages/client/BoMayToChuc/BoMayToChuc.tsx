const facultyData = [
  {
    name: "Hoàng Ngọc Dũng",
    education: "Thạc sĩ Kinh tế, Cử nhân Kinh tế kỹ thuật",
    skill:
      "Nghiệp vụ quản lý cơ sở GDNN, Chứng chỉ kế toán trưởng, Nghiệp vụ sư phạm nghề",
  },
  {
    name: "Nguyễn Hữu Phước",
    education: "Thạc sĩ Quản lý giáo dục, Cử nhân Khoa học",
    skill: "Bằng tốt nghiệp cao cấp lý luận chính trị",
  },
  {
    name: "Nguyễn Hữu Thống",
    education:
      "Thạc sĩ Quản lý giáo dục, Cử nhân Ngôn ngữ Anh, Cử nhân Tin học",
    skill:
      "Chứng chỉ nghiệp vụ sư phạm, Bằng trung cấp lý luận chính trị – Hành chính",
  },
  {
    name: "Nguyễn Thị Ngọc Hạnh",
    education: "Cử nhân du lịch",
    skill: "Chứng chỉ nghiệp vụ sư phạm dạy nghề",
  },
  {
    name: "Lê Việt Anh",
    education: "Cử nhân Quản trị kinh doanh du lịch và khách sạn",
    skill: "Chứng chỉ nghiệp vụ sư phạm dạy nghề",
  },
  {
    name: "Hồ Đăng Bảo Ngọc",
    education: "Cử nhân Ngôn ngữ Anh",
    skill: "Chứng chỉ nghiệp vụ sư phạm",
  },
  {
    name: "Nguyễn Thị Phương Loan",
    education: "Cử nhân Công nghệ thông tin",
    skill: "Chứng chỉ nghiệp vụ sư phạm",
  },
  {
    name: "Nguyễn Thành Đạo",
    education: "Thạc sĩ Văn hóa học",
    skill:
      "Giảng viên nhiều trường Đại học/Cao đẳng uy tín, Trợ lý Hiệu trưởng về hợp tác quốc tế",
  },
  {
    name: "Nguyễn Hoàng Chương",
    education: "Thạc sĩ Quản trị kinh doanh",
    skill:
      "PTS chuyên ngành Quản trị tổ chức, Tư vấn phát triển nhân lực, Giảng viên các trường ĐH lớn",
  },
  {
    name: "Ngụy Lệ Hồng",
    education: "Thạc sĩ Kỹ thuật công nghệ thực phẩm – dinh dưỡng",
    skill:
      "Nghiệp vụ sư phạm bậc 2, Nghiệp vụ kỹ thuật phân tích vi sinh, Phó phòng R&D",
  },
  {
    name: "Võ Thị Ngọc Thúy",
    education: "Thạc sĩ Kinh tế",
    skill:
      "Chuyên môn về Kế toán tài chính, Kế toán quản trị, Giảng viên Cao đẳng Kinh tế",
  },
  {
    name: "Nguyễn Đoàn Bảo Tuyền",
    education: "Thạc sĩ Văn hóa học",
    skill:
      "Giảng viên Cao đẳng Văn hóa nghệ thuật TP.HCM, Nghiệp vụ Sư phạm dạy nghề",
  },
  {
    name: "Tô Nhi A",
    education: "Thạc sĩ Tâm lý học",
    skill:
      "Chuyên gia kỹ năng mềm, Tâm lý giao tiếp, Giảng viên tại nhiều trường Đại học/Cao đẳng",
  },
  {
    name: "Nguyễn Trọng Phước",
    education:
      "Thạc sĩ Quản lý Giáo dục, Cử nhân Luật, Báo chí, Truyền thông, Quan hệ Quốc tế",
    skill: "Giảng viên chuyên ngành",
  },
  {
    name: "Nguyễn Thị Thoa",
    education: "Thạc sĩ Văn hóa học",
    skill: "Giảng viên, Biên tập viên sự kiện, Kinh nghiệm quản lý kinh doanh",
  },
  {
    name: "Nguyễn Tấn Mạnh",
    education: "Thạc sĩ Khoa học Xã hội và Nhân văn",
    skill: "Giảng dạy chính trị (Lịch sử), Nghiệp vụ sư phạm dạy nghề",
  },
  {
    name: "Nguyễn Thị Lý",
    education: "Thạc sĩ Lịch sử",
    skill: "Giảng viên Cao đẳng Văn hóa – Nghệ thuật – Du lịch Sài Gòn",
  },
  {
    name: "Trần Phát",
    education:
      "Thạc sĩ QTKD, Cử nhân Marketing, Cử nhân Quản trị du lịch và lữ hành",
    skill: "Nghiệp vụ sư phạm nghề, Thẻ hành nghề HDV du lịch Quốc tế",
  },
  {
    name: "Trần Thị Như Quỳnh",
    education: "Cử nhân Quản trị kinh doanh",
    skill:
      "Nghiệp vụ sư phạm dạy nghề, Phó phòng Tuyển sinh – Truyền thông TCN Trần Đại Nghĩa",
  },
  {
    name: "Bùi Cao Trưởng",
    education: "Cử nhân CNTT",
    skill:
      "Nghiệp vụ sư phạm dạy nghề, Phó phòng Đào tạo – Khảo thí TCN Trần Đại Nghĩa",
  },
  {
    name: "Hồ Thị Hồng",
    education: "Cử nhân CNTT",
    skill: "Nghiệp vụ sư phạm dạy nghề",
  },
  {
    name: "Nguyễn Thanh Sơn",
    education: "CC nghề bậc 7/7",
    skill: "Nghiệp vụ sư phạm dạy nghề, Chuyên gia nghiệp vụ bếp Âu Á",
  },
  {
    name: "Nguyễn Văn Đính",
    education: "F&B Management Course (SHATec)",
    skill: "Giám đốc F&B, Giảng viên chuyên ngành quản lý nhà hàng",
  },
  {
    name: "Hoàng Thị Thu Loan",
    education: "Cử nhân Tiếng Anh",
    skill:
      "Chuyên gia nghiệp vụ khách sạn, Đào tạo viên VTCB, Kinh nghiệm quản lý khách sạn 4-5 sao",
  },
  {
    name: "Nguyễn Phát Thảo",
    education: "Thạc sĩ Quản trị khách sạn – Nhà hàng",
    skill: "Nghiệp vụ sư phạm, Tổng quản lý các khách sạn 4 sao",
  },
  {
    name: "Đoàn Chí Dũng",
    education: "Nghiệp vụ chuyên ngành",
    skill:
      "Tổng quản lý chuỗi nhà hàng, chuyên nghiệp về nghiệp vụ bàn, pha chế",
  },
  {
    name: "Nguyễn Duy Anh Kiệt",
    education: "Cử nhân Quản trị khách sạn – Nhà hàng",
    skill: "Nghiệp vụ sư phạm dạy nghề, Giảng viên Đại học Kỹ thuật Công nghệ",
  },
  {
    name: "Đào Thị Duyến",
    education: "Thạc sĩ công nghệ thực phẩm",
    skill:
      "Quản lý bếp ăn công nghiệp, Giảng viên nhiều trường Đại học/Cao đẳng",
  },
  {
    name: "Trần Văn Trắng",
    education: "Cử nhân Hướng dẫn du lịch, Cử nhân Anh văn",
    skill: "Nghiệp vụ hướng dẫn du lịch",
  },
  {
    name: "Nguyễn Lê Na",
    education: "Cử nhân Tâm lý học giáo dục",
    skill: "Tâm lý giao tiếp trong du lịch",
  },
];

const BoMayToChuc = () => {
  return (
    <div className="bg-slate-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-900 uppercase">
          Đội ngũ giảng viên
        </h1>

        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12 leading-relaxed">
          Giáo viên hiện đang theo dạy tại Trường, có học hàm, học vị: Thạc sĩ,
          Đại học, các nghệ nhân đang làm việc lâu năm. Các cán bộ quản lý bao
          gồm: Hiệu trưởng, Phó Hiệu trưởng, Trưởng và Phó Trưởng phòng Tuyển
          sinh – Đào tạo, Phó phòng hành chánh – QLSV và các nhân viên.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facultyData.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border-l-4 border-blue-600 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-bold text-blue-900 mb-3">
                {index + 1}. {item.name}
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">
                  <span className="font-semibold block text-gray-900">
                    Trình độ đào tạo:
                  </span>
                  {item.education}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold block text-gray-900">
                    Trình độ nghiệp vụ:
                  </span>
                  {item.skill}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoMayToChuc;
