import API from "../api/axios";

export const createLead = async (data) => {
  return API.post("/leads", data);
};

export const updateLead = async (id, data) => {
  return API.patch(`/leads/${id}`, data);
};

export const getUsers = async () => {
  return API.get("/users");
};

export const fetchLeadsApi = (filters, page) => {

  return API.get("/leads", {
    params: {
      q: filters.search,
      status: filters.status,
      source: filters.source,
      createdFrom: filters.createdFrom,
      createdTo: filters.createdTo,
      sort: filters.sort,
      page,
      limit: 10
    }
  });

};

export const deleteLeadApi = (id) => {
  return API.delete(`/leads/${id}`);
};