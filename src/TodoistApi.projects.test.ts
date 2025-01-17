import { TodoistApi } from ".";
import {
  DEFAULT_AUTH_TOKEN,
  DEFAULT_PROJECT,
  DEFAULT_REQUEST_ID,
  DEFAULT_USER,
  PROJECT_WITH_OPTIONALS_AS_NULL,
} from "./testUtils/testDefaults";
import {
  ENDPOINT_REST_PROJECT_COLLABORATORS,
  ENDPOINT_REST_PROJECTS,
  getRestBaseUri,
} from "./consts/endpoints";
import { setupRestClientMock } from "./testUtils/mocks";

function getTarget() {
  return new TodoistApi(DEFAULT_AUTH_TOKEN);
}

describe("TodoistApi project endpoints", () => {
  describe("getProject", () => {
    test("calls get request with expected url", async () => {
      const projectId = "12";
      const requestMock = setupRestClientMock(DEFAULT_PROJECT);
      const api = getTarget();

      await api.getProject(projectId);

      expect(requestMock).toBeCalledTimes(1);
      expect(requestMock).toBeCalledWith(
        "GET",
        getRestBaseUri(),
        `${ENDPOINT_REST_PROJECTS}/${projectId}`,
        DEFAULT_AUTH_TOKEN,
      );
    });

    test("returns result from rest client", async () => {
      setupRestClientMock(DEFAULT_PROJECT);
      const api = getTarget();

      const project = await api.getProject("123");

      expect(project).toEqual(DEFAULT_PROJECT);
    });
  });

  describe("getProjects", () => {
    test("calls get on projects endpoint", async () => {
      const requestMock = setupRestClientMock([DEFAULT_PROJECT]);
      const api = getTarget();

      await api.getProjects();

      expect(requestMock).toBeCalledTimes(1);
      expect(requestMock).toBeCalledWith(
        "GET",
        getRestBaseUri(),
        ENDPOINT_REST_PROJECTS,
        DEFAULT_AUTH_TOKEN,
      );
    });

    test("returns result from rest client", async () => {
      const projects = [DEFAULT_PROJECT, PROJECT_WITH_OPTIONALS_AS_NULL];
      setupRestClientMock(projects);
      const api = getTarget();

      const response = await api.getProjects();

      expect(response).toEqual(projects);
    });
  });

  describe("addProject", () => {
    const DEFAULT_ADD_PROJECT_ARGS = {
      name: "This is a project",
    };

    test("calls post on restClient with expected parameters", async () => {
      const requestMock = setupRestClientMock(DEFAULT_PROJECT);
      const api = getTarget();

      await api.addProject(DEFAULT_ADD_PROJECT_ARGS, DEFAULT_REQUEST_ID);

      expect(requestMock).toBeCalledTimes(1);
      expect(requestMock).toBeCalledWith(
        "POST",
        getRestBaseUri(),
        ENDPOINT_REST_PROJECTS,
        DEFAULT_AUTH_TOKEN,
        DEFAULT_ADD_PROJECT_ARGS,
        DEFAULT_REQUEST_ID,
      );
    });

    test("returns result from rest client", async () => {
      setupRestClientMock(DEFAULT_PROJECT);
      const api = getTarget();

      const project = await api.addProject(DEFAULT_ADD_PROJECT_ARGS);

      expect(project).toEqual(DEFAULT_PROJECT);
    });
  });

  describe("updateProject", () => {
    const DEFAULT_UPDATE_PROJECT_ARGS = { name: "a name" };
    test("calls post on restClient with expected parameters", async () => {
      const projectId = "123";
      const updateArgs = { name: "a new name" };
      const requestMock = setupRestClientMock(DEFAULT_PROJECT, 204);
      const api = getTarget();

      await api.updateProject(projectId, updateArgs, DEFAULT_REQUEST_ID);

      expect(requestMock).toBeCalledTimes(1);
      expect(requestMock).toBeCalledWith(
        "POST",
        getRestBaseUri(),
        `${ENDPOINT_REST_PROJECTS}/${projectId}`,
        DEFAULT_AUTH_TOKEN,
        updateArgs,
        DEFAULT_REQUEST_ID,
      );
    });

    test("returns success result from rest client", async () => {
      const returnedProject = {
        ...DEFAULT_PROJECT,
        DEFAULT_UPDATE_PROJECT_ARGS,
      };
      setupRestClientMock(returnedProject, 204);
      const api = getTarget();

      const result = await api.updateProject(
        "123",
        DEFAULT_UPDATE_PROJECT_ARGS,
      );

      expect(result).toEqual(returnedProject);
    });
  });

  describe("deleteProject", () => {
    test("calls delete on expected project", async () => {
      const projectId = "123";
      const requestMock = setupRestClientMock(undefined, 204);
      const api = getTarget();

      await api.deleteProject(projectId, DEFAULT_REQUEST_ID);

      expect(requestMock).toBeCalledTimes(1);
      expect(requestMock).toBeCalledWith(
        "DELETE",
        getRestBaseUri(),
        `${ENDPOINT_REST_PROJECTS}/${projectId}`,
        DEFAULT_AUTH_TOKEN,
        undefined,
        DEFAULT_REQUEST_ID,
      );
    });

    test("returns success result from rest client", async () => {
      setupRestClientMock(undefined, 204);
      const api = getTarget();

      const result = await api.deleteProject("123");

      expect(result).toEqual(true);
    });
  });

  describe("getProjectCollaborators", () => {
    const projectId = "123";
    const users = [DEFAULT_USER];

    test("calls get on expected endpoint", async () => {
      const requestMock = setupRestClientMock(users);
      const api = getTarget();

      await api.getProjectCollaborators(projectId);

      expect(requestMock).toBeCalledTimes(1);
      expect(requestMock).toBeCalledWith(
        "GET",
        getRestBaseUri(),
        `${ENDPOINT_REST_PROJECTS}/${projectId}/${ENDPOINT_REST_PROJECT_COLLABORATORS}`,
        DEFAULT_AUTH_TOKEN,
      );
    });

    test("returns result from rest client", async () => {
      setupRestClientMock(users);
      const api = getTarget();

      const returnedUsers = await api.getProjectCollaborators(projectId);

      expect(returnedUsers).toEqual(users);
    });
  });
});
