jest.mock('../models/user');
const User = require('../models/user');
const { addFollowing } = require('./user');

describe('addFollowing', () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  const res = {
    send: jest.fn(),
    status: jest.fn( () => res ) 
  };
  const next = jest.fn();

  test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함', async () => {
    //given
    User.findOne.mockReturnValue(Promise.resolve({
      addFollowing(id) {
        return Promise.resolve(true)
      }
    }))
    
    //when
    await addFollowing(req, res, next);
    // then
    expect(res.send).toBeCalledWith('success');
  });

  test('사용자를 못 찾으면 status 404를 호출하고 no user를 send 한다', async () => {
    // given 

    // const user = await User.findOne({ where: { id: req.user.id } });
    User.findOne.mockReturnValue(null)

    // when
    await addFollowing(req, res, next);
    
    // then
    expect(res.send).toBeCalledWith('no user');
    expect(res.status).toBeCalledWith(404);
  });

  test('에러가 발생하면 next(error) 를 보내준다', async () => {
    // given 
    const error = "에러가 발생했습니다"
    User.findOne.mockReturnValue(
        Promise.reject(error)
    )
    // when
    await addFollowing(req, res, next);
    
    // then
    expect(next).toBeCalledWith(error)
  });
});