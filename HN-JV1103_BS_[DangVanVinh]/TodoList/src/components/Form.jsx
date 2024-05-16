import React, { useState, useEffect, useRef } from "react";
import emptyImage from "../assets/1.jpg";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, Input } from "antd";

library.add(faPen, faTrash);

export default function Form() {
  const [isModalOpen, setIsModalOpen] = useState(false);  // điều khiển việc hiển thị hoặc ẩn modal
  const [currentJob, setCurrentJob] = useState({});
  const inputRef = useRef(null);    // Tạo ref cho ô input

  useEffect(() => {
    inputRef.current.focus();     //// Focus vào ô input khi ứng dụng được chạy
  }, []);

  const [jobs, setJobs] = useState(() => {
    const savedJobs = JSON.parse(localStorage.getItem("jobs"));   // lấy từ local về
    return savedJobs || [];
  });

  const [job, setJob] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));  // lưu lên local
  }, [jobs]);

  const handleChange = (e) => {
    setJob(e.target.value);
  };

  const handleModalChange = (e) => {
    setCurrentJob({ ...currentJob, name: e.target.value });
  };

  const handleAdd = () => {
    if (job.trim() === "") {   // validate
      setError("Tên công việc không được để trống");
      return;
    }
    if (editId) {
      setJobs(jobs.map((j) => (j.id === editId ? { ...j, name: job } : j)));
      setEditId(null);
    } else {
      const newJob = { id: Date.now(), name: job };
      setJobs([...jobs, newJob]);
      localStorage.setItem("jobs", JSON.stringify([...jobs, newJob]));  // lưu lên local
    }
    setJob("");
    setError("");
    inputRef.current.focus();    // Focus vào ô input sau khi thêm công việc thành công
  };

  const handleDelete = (id) => {
    let choice = window.confirm("Bạn có chắc chắn muốn xóa không?");
    if (choice) {
      setJobs(jobs.filter((job) => job.id !== id));
    }
  };

  // sửa
  const handleEdit = (id) => {
    const updatedJobs = jobs.map((j) =>
      j.id === id ? { ...j, name: currentJob.name } : j
    );
    setJobs(updatedJobs);
    setError("");
  };

  // antd design
  const showModal = (job) => {
    setCurrentJob(job);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (currentJob.name.trim() === "") {
      setModalError("Tên công việc không được để trống");
      return;
    }
    handleEdit(currentJob.id);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="container">
        <h1>Danh sách công việc</h1>
        <br />
        <input
          ref={inputRef}
          onChange={handleChange}
          value={job}
          type="text"
          placeholder="   Nhập tên công việc"
        />
        <button onClick={handleAdd} className="btn">
          {editId ? "Update" : "Thêm"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      {jobs.length === 0 ? (
        <div className="body">
          <img
            src={emptyImage}
            alt="No jobs available"
            className="empty-image"
          />
        </div>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              {job.name}
              <span type="primary" onClick={() => showModal(job)}>
                <FontAwesomeIcon icon={faPen} className="font" />
              </span>
              <Modal
                title="Edit Job"
                visible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <Input
                  value={currentJob.name}
                  onChange={handleModalChange}
                  placeholder="Edit job name"
                />
              </Modal>
              <span onClick={() => handleDelete(job.id)}>
                <FontAwesomeIcon icon={faTrash} className="font" />
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}